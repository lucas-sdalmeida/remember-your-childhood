import { UUID } from "../../../../../util/types";
import { UserAccountId } from "../../../../domain/model/user";
import { PasswordRetriever } from "../../../../domain/services";
import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { userFromDTO } from "../../../user/repository/user-dto";
import { memoryFromDTO, memoryToDTO } from "../../repository/memory-dto";
import MemoryRepository from "../../repository/memory-repository";
import FindAllMemoriesService from "../find-all-memories-service";
import ResponseModel from "../response-model";

export default class FindAllMemoriesServiceImpl implements FindAllMemoriesService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly passwordRetriver: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    findAll(credentials: Credentials): ResponseModel[] {
        const requesterDTO = this.authenticatorService.authenticate(credentials)
        const requester = userFromDTO(requesterDTO, this.passwordRetriver)

        return this.memoryRepository.findAll()
            .map(memo => memoryFromDTO(memo))
            .filter(memo => !requester.hasBlocked(memo.ownerId))
            .filter(memo => memo.visibility.isAllowedToSee(requester.id))
            .map(memo => memoryToDTO(memo))
            .map(memo => { return { memory: memo } })
    }
}
