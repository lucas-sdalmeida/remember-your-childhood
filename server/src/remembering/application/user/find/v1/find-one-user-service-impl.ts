import { AuthenticatorService, Credentials } from "../../../../../auth";
import { UUID } from "../../../../../util/types";
import { UserId } from "../../../../domain/model/user";
import { UserRepository } from "../../repository";
import { userFromDTO } from "../../repository/user-dto";
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
