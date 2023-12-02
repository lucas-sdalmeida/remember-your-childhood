import { Credentials } from "../../../../auth";
import ResponseModel from "./response-model";

export default interface FindAllUsersService {
    findAll(credentials: Credentials): ResponseModel[]
}