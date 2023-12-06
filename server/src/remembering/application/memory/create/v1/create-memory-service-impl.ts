import { UUID } from "../../../../../util/types";
import { UUIDGenerator } from "../../../../domain/services";
import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { UserRepository } from "../../../user/repository";
import { memoryToDTO } from "../../repository/memory-dto";
import MemoryRepository from "../../repository/memory-repository";
import CreateMemoryService, { RequestModel, ResponseModel, memoryFromRequestModel } from "../create-memory-service";

export default class CreateMemoryServiceImpl implements CreateMemoryService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly userRepository: UserRepository,
        private readonly uuidGenerator: UUIDGenerator,
        private authenticatorService: AuthenticatorService,
    ) {}

    async create(ownerId: UUID, model: RequestModel, credentials: Credentials): Promise<ResponseModel> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)

        if (!(await this.userRepository.existsById(ownerId)))
            throw new Error(`There is not a user with id: ${ownerId}`)
        if (ownerId != requesterDTO.id)
            throw new Error(`The requester with id ${requesterDTO.id} cannot create memories for ${ownerId}`)

        const id = await this.uuidGenerator.next()
        const memory = memoryFromRequestModel(id, ownerId, model)

        await this.memoryRepository.create(memoryToDTO(memory))

        return { id: id }
    }
}
