import { UUIDGenerator } from "../../../../domain/services";
import { UserRepository, userToDTO } from "../../repository";
import CreateUserService, { RequestModel, ResponseModel, userFromRequestModel } from "../create-user-service";

export default class CreateUserServiceImpl implements CreateUserService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly uuidGenerator: UUIDGenerator,
    ) {}

    create(model: RequestModel): ResponseModel {
        if (this.userRepository.existsByUsername(model.username))
            throw new Error(`The username < ${model.username} > already is in use!`)
        
        const id = this.uuidGenerator.next()
        const user = userFromRequestModel(id, model)

        this.userRepository.create(userToDTO(user))

        return { id: id }
    }
}
