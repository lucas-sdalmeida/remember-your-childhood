import Credentials from "../../shared/credentials";
import { UserAccountDTO, UserRepository } from "../../../user/repository";
import AuthenticationError from "../authentication-error";
import AuthenticatorService from "../authenticator-service";

export default class AuthenticatorServiceImpl implements AuthenticatorService {
    constructor (
        private readonly accountRepository: UserRepository,
    ) {}

    async authenticate(credentials: Credentials): Promise<UserAccountDTO> {
        const userDTO = await this.accountRepository.findById(credentials.userId)
        if (!userDTO)
            throw new AuthenticationError(`There is not a account with id: ${credentials.userId.toString()}`)
        if (credentials.logoutDateTime)
            throw new AuthenticationError(`The acccount ${userDTO.id.toString()} has already log-out.`)
        if (credentials.expirationDateTime < new Date())
            throw new AuthenticationError(`The session of account ${userDTO.id.toString()} has already expired`)
        return userDTO
    }
}
