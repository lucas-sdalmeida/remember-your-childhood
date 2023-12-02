import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { UUID } from "../../../../../util/types";
import { UserRepository } from "../../repository";
import FindOneUserService from "../find-one-user-service";
import ResponseModel from "../response-model";

export default class FindOneUserServiceImpl implements FindOneUserService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    findById(id: UUID, credentials: Credentials): ResponseModel | undefined {
        this.authenticatorService.authenticate(credentials)
        const dto = this.userRepository.findByIdIfHasNotBlocked(id, credentials.userId)
        return dto ? { user: dto } : undefined
    }
}
