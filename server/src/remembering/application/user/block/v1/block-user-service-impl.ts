import { UUID } from "../../../../../util/types";
import { PasswordRetriver } from "../../../../domain/services";
import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { UserRepository } from "../../repository";
import { userFromDTO, userToDTO } from "../../repository/user-dto";
import BlockUserService from "../block-user-service";

export default class BlockUserServiceImpl implements BlockUserService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly passwordRetriver: PasswordRetriver,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    block(blockingUserId: UUID, credentials: Credentials): void {
        this.authenticatorService.authenticate(credentials)
        
        const blockingUserDto = this.userRepository.findById(blockingUserId)
        if (!blockingUserDto)
            throw new Error(`There is not a user with id: ${blockingUserId}`)

        const blockerDto = this.userRepository.findById(credentials.userId)!!

        const blockingPassword = this.passwordRetriver.retrieve(blockingUserDto.password)
        const blockingUser = userFromDTO(blockingUserDto, blockingPassword)

        const blockerPassword = this.passwordRetriver.retrieve(blockerDto.password)
        const blocker = userFromDTO(blockerDto, blockerPassword)

        blocker.block(blockingUser.id)
        blockingUser.block(blocker.id)

        this.userRepository.create(userToDTO(blocker))
        this.userRepository.create(userToDTO(blockingUser))
    }
}
