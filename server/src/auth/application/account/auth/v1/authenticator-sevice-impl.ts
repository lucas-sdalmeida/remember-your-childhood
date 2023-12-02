import { RawPassword } from "../../../../domain/model/account/password";
import { PasswordChecker } from "../../../../domain/services";
import { AccountRepository } from "../../repository";
import Credentials from "../../shared/credentials";
import AuthenticationError from "../authentication-error";
import AuthenticatorService from "../authenticator-service";

export default class AuthenticatorServiceImpl implements AuthenticatorService {
    constructor (
        private readonly accountRepository: AccountRepository,
    ) {}

    authenticate(credentials: Credentials): void {
        if (!this.accountRepository.existsById(credentials.accountId))
            throw new AuthenticationError(`There is not a account with id: ${credentials.accountId}`)
        if (!this.accountRepository.existsByIdAndUserId(credentials.accountId, credentials.userId))
            throw new AuthenticationError(`The account ${credentials.accountId} does not belongs to user: ${credentials.userId}`)
        if (credentials.logoutDateTime)
            throw new AuthenticationError(`The acccount ${credentials.accountId} has already log-out.`)
        if (credentials.expirationDateTime < new Date())
            throw new AuthenticationError(`The session of account ${credentials.accountId} has already expired`)
    }
}
