import { UserAccount, Username } from "../../../../domain/model/user";
import Email from "../../../../domain/model/user/email";
import { RawPassword } from "../../../../domain/model/user/password";
import { PasswordChecker, PasswordRetriever } from "../../../../domain/services";
import { UserAccountDTO, UserRepository } from "../../../user/repository";
import { userFromDTO } from "../../../user/repository/user-dto";
import Credentials, { createCredentials } from "../../shared/credentials";
import LoginService, { RequestModel } from "../login-service";

export default class LoginServiceImpl implements LoginService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly passwordChecker: PasswordChecker,
    ) {}

    async login(model: RequestModel): Promise<Credentials> {
        const user = await this.findUser(model)
        const rawPassword = RawPassword.of(model.password)
        
        if (!(await this.passwordChecker.compare(rawPassword, user.password)))
            throw new Error(`Wrong password for user: ${user.username.toString()}`)

        return createCredentials(user.id.value)
    }

    private async findUser({ username: dtoUsername, email: dtoEmail }: RequestModel): Promise<UserAccount> {
        if (!dtoUsername && !dtoEmail)
            throw new Error('At least one between the username and the e-mail must be given to login!')

        let dto: UserAccountDTO | undefined
        const email = dtoEmail ? Email.of(dtoEmail) : undefined
        const username = dtoUsername ? Username.of(dtoUsername) : undefined

        dto = await this.findByUsernameAndEmail(username, email)
        if (!dto) dto = await this.findByEmail(email)
        if (!dto) dto = await this.findByUsername(username)
        
        if (!dto) throw new Error(
            `There is not a user with:${ username ? ' username=' + username.toString() : '' }` + 
                `${ email ? ' email=' + email.toString() : '' }`
        )
        
        return userFromDTO(dto, this.passwordRetriever)
    }

    private async findByUsernameAndEmail(username?: Username, email?: Email): Promise<UserAccountDTO | undefined> {
        if (!username || !email) 
            return undefined

        const dto = await this.userRepository.findByUsernameAndEmail(username.toString(), email.toString())
        
        if (!dto) 
            throw new Error(`The username ${username.toString()} does not belongs to user with e-mail ${email.toString()}`)

        return dto
    }

    private async findByEmail(email?: Email): Promise<UserAccountDTO | undefined> {
        if (email)
            return this.userRepository.findByEmail(email.toString())
        return undefined
    }

    private async findByUsername(username?: Username): Promise<UserAccountDTO | undefined> {
        if (username) 
            return this.userRepository.findByUsername(username.toString())
        return undefined
    }
}
