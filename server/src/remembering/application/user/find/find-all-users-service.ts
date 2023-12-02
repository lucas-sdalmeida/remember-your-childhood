import Credentials from "../shared/credentials";
import ResponseModel from "./response-model";

export default interface FindAllUsersService {
    findAll(credentials: Credentials): ResponseModel[]
}
