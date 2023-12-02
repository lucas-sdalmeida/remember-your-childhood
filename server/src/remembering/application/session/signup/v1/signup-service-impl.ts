import { CreateUserService, RequestModel } from "../../../user/create";
import Credentials, { createCredentials } from "../../shared/credentials";
import SignUpService from "../signup-service";

export default class SignUpServideImpl implements SignUpService {
    constructor (
        private readonly createUserService: CreateUserService,
    ) {}

    signup(model: RequestModel): Credentials {
        const id = this.createUserService.create(model).id
        return createCredentials(id)
    }
}
