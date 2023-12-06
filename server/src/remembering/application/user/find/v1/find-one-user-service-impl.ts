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

    async findById(id: UUID, credentials: Credentials): Promise<ResponseModel | undefined> {
        await this.authenticatorService.authenticate(credentials)
        const dto = await this.userRepository.findByIdIfHasNotBlocked(id, credentials.userId)
        return dto ? { user: { 
            id: dto.id,
            username: dto.username,
            email: dto.email,
            followingList: dto.followingList,
            blockList: dto.blockList
        } } : undefined
    }
}
