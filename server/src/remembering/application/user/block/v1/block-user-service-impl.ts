import { UUID } from "../../../../../util/types";
import { PasswordRetriever } from "../../../../domain/services";
import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { UserRepository } from "../../repository";
import { userFromDTO, userToDTO } from "../../repository/user-dto";
import BlockUserService from "../block-user-service";

export default class BlockUserServiceImpl implements BlockUserService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    async block(blockingUserId: UUID, credentials: Credentials): Promise<void> {
        const blockerDTO = await this.authenticatorService.authenticate(credentials)
        const blocker = userFromDTO(blockerDTO, this.passwordRetriever)
        
        const blockingUserDto = await this.userRepository.findById(blockingUserId)
        if (!blockingUserDto)
            throw new Error(`There is not a user with id: ${blockingUserId.toString()}`)

        const blockingUser = userFromDTO(blockingUserDto, this.passwordRetriever)

        blocker.block(blockingUser.id)
        blockingUser.block(blocker.id)

        await this.userRepository.create(userToDTO(blocker))
        await this.userRepository.create(userToDTO(blockingUser))
    }
}
