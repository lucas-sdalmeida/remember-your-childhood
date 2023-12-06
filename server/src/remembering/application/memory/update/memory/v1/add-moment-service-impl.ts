import { UUID } from "../../../../../../util/types";
import { Moment } from "../../../../../domain/model/memory";
import { PasswordRetriever } from "../../../../../domain/services";
import { AuthenticatorService } from "../../../../session/auth";
import Credentials from "../../../../session/shared/credentials";
import { userFromDTO } from "../../../../user/repository/user-dto";
import { memoryFromDTO, memoryToDTO } from "../../../repository/memory-dto";
import MemoryRepository from "../../../repository/memory-repository";
import ResponseModel from "../../response-model";
import AddMomentService, { RequestModel } from "../add-moment-service";

export default class AddMomentServiceImpl implements AddMomentService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticator: AuthenticatorService,
    ) {}

    async add(id: UUID, model: RequestModel, credentials: Credentials): Promise<ResponseModel> {
        const requesterDTO = await this.authenticator.authenticate(credentials)
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)
        const memoryDTO = await this.memoryRepository.findById(id)

        if (!memoryDTO)
            throw new Error(`There is not a memory with id: ${id}`)

        const memory = memoryFromDTO(memoryDTO)

        if (memory.ownerId != requester.id)
            throw new Error(`The user with id ${requester.id.toString()} has not editing permission over memory ${id.toString()}`)

        memory.rememberMoment(new Moment(model.description))
        await this.memoryRepository.create(memoryToDTO(memory))

        return { id: id}
    }
}
