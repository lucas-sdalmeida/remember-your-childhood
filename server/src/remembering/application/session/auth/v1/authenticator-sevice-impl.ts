import Credentials from "../../shared/credentials";
import { UserRepository } from "../../../user/repository";
import AuthenticationError from "../authentication-error";
import AuthenticatorService from "../authenticator-service";

export default class AuthenticatorServiceImpl implements AuthenticatorService {
    constructor (
        private readonly accountRepository: UserRepository,
    ) {}

    authenticate(credentials: Credentials): void {
        if (!this.accountRepository.existsById(credentials.userId))
            throw new AuthenticationError(`There is not a account with id: ${credentials.userId.toString()}`)
        if (credentials.logoutDateTime)
            throw new AuthenticationError(`The acccount ${credentials.userId.toString()} has already log-out.`)
        if (credentials.expirationDateTime < new Date())
            throw new AuthenticationError(`The session of account ${credentials.userId.toString()} has already expired`)
    }
}
