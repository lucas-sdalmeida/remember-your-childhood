import { UUID } from "../../../../../../util/types";
import { UserAccountId } from "../../../../../domain/model/user";
import { PasswordRetriever } from "../../../../../domain/services";
import { AuthenticatorService } from "../../../../session/auth";
import Credentials from "../../../../session/shared/credentials";
import { UserRepository } from "../../../../user/repository";
import { userFromDTO } from "../../../../user/repository/user-dto";
import { memoryFromDTO, memoryToDTO } from "../../../repository/memory-dto";
import MemoryRepository from "../../../repository/memory-repository";
import ResponseModel from "../../response-model";
import AllowUserToSeeService from "../allow-user-to-see-service";

export default class AllowUserToSeeServiceImpl implements AllowUserToSeeService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly userRepository: UserRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    async allowUser(memoryId: UUID, userId: UUID, credentials: Credentials): Promise<ResponseModel> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)
        const memoryDTO = await this.memoryRepository.findById(memoryId)

        if (requester.id.value == userId)
            return { id: memoryId }
        if (!memoryDTO) throw new Error(
            `There is not a memory with id: ${memoryId}`
        )
        if (!this.userRepository.existsById(userId)) throw new Error(
            `There is not a user with id: ${userId.toString()}`
        )

        const memory = memoryFromDTO(memoryDTO)

        if (memory.ownerId != requester.id) throw new Error(
            `The user with id ${requester.id.toString()} has not editing permissions over memory ${memoryId.toString()}`
        )

        memory.grantPermissionToSee(new UserAccountId(userId))
        await this.memoryRepository.create(memoryToDTO(memory))

        return { id: memoryId }
    }
}
