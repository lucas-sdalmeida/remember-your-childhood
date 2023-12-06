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
import BlockUserToSeeService from "../block-user-to-see";

export default class BlockUserToSeeServiceImpl implements BlockUserToSeeService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly userRepository: UserRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    async blockUser(memoryId: UUID, userId: UUID, credentials: Credentials): Promise<ResponseModel> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)

        if (requester.id.value == userId) throw new Error(
            `User with id ${requester.id.toString()} cannot block themself to see their own memories`
        )
        if (!(await this.userRepository.existsById(userId))) throw new Error(
            `There is not a user with id ${userId.toString()} to block`
        )

        const memoryDTO = await this.memoryRepository.findById(memoryId)
        if (!memoryDTO) throw new Error(
            `There is not a memory with id: ${memoryId.toString()}`
        )
        
        const memory = memoryFromDTO(memoryDTO)
        if (memory.ownerId != requester.id) throw new Error(
            `The user with id ${requester.id.toString()} does not have editing permissions over memory ${memory.id.toString()}`
        )

        memory.revokePermissionToSee(new UserAccountId(userId))
        await this.memoryRepository.create(memoryToDTO(memory))

        return { id: memoryId }
    }
}
