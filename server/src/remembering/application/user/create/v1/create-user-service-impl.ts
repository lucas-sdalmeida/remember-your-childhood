import { RawPassword } from "../../../../domain/model/user/password";
import { PasswordEncrypter, UUIDGenerator } from "../../../../domain/services";
import { UserRepository, userToDTO } from "../../repository";
import CreateUserService, { RequestModel, ResponseModel, userFromRequestModel } from "../create-user-service";

export default class CreateUserServiceImpl implements CreateUserService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly uuidGenerator: UUIDGenerator,
        private readonly passwordEncrypter: PasswordEncrypter,
    ) {}

    create(model: RequestModel): ResponseModel {
        if (this.userRepository.existsByEmail(model.email))
            throw new Error(`There already is a account with that uses the email: ${model.email}`)
        if (this.userRepository.existsByUsername(model.username))
            throw new Error(`The username < ${model.username} > already is in use!`)
        

        const id = this.uuidGenerator.next()
        const password = this.passwordEncrypter.encrypt(RawPassword.of(model.password))
        const user = userFromRequestModel(id, password, model)

        this.userRepository.create(userToDTO(user))
        return { id: id }
    }
}