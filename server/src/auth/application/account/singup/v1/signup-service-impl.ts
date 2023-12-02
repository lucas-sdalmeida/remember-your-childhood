import { CreateUserService, UUIDGenerator, UserId } from "../../../../../remembering";
import { Account, AccountId, Email } from "../../../../domain/model/account";
import { RawPassword } from "../../../../domain/model/account/password";
import { PasswordEncrypter } from "../../../../domain/services";
import { AccountRepository } from "../../repository";
import { accountToDTO } from "../../repository/account-dto";
import Credentials, { createCredentials } from "../../shared/credentials";
import SignUpService, { RequestModel } from "../signup-service";

export default class SignUpServiceImpl implements SignUpService {
    constructor (
        private readonly accountRepository: AccountRepository,
        private readonly uuidGenerator: UUIDGenerator,
        private readonly createUserService: CreateUserService,
        private readonly passwordEncrypter: PasswordEncrypter,
    ) {}

    signup(model: RequestModel): Credentials {
        const email = Email.of(model.email)
        
        if (this.accountRepository.existsByEmail(email.toString()))
            throw new Error(`There already is a account with that uses the email: ${model.email}`)
    
        const userId = this.createUserService.create(model.userRequestModel).id
        const password = this.passwordEncrypter.encrypt(RawPassword.of(model.rawPassword))
        const id = this.uuidGenerator.next()

        const account = new Account(
            new AccountId(id),
            new UserId(userId),
            email,
            password,
        )

        this.accountRepository.create(accountToDTO(account))
        return createCredentials(id, userId)
    }
}
