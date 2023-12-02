import { AuthenticatorService, Credentials } from "../../../../../auth";
import { UserRepository } from "../../repository";
import FindAllUsersService from "../find-all-users-service";
import ResponseModel from "../response-model";

export default class FindAllUsersServiceImpl implements FindAllUsersService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly authenticator: AuthenticatorService,
    ) {}

    findAll(credentials: Credentials): ResponseModel[] {
        this.authenticator.authenticate(credentials)
        return this.userRepository.findAllThatHasNotBlocked(credentials.userId)
            .map(dto => { return { user: dto } })
    }
}
