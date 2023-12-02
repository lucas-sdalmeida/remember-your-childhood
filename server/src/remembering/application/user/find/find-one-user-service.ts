import { Credentials } from "../../../../auth";
import { UUID } from "../../../../util/types";
import ResponseModel from "./response-model";

export default interface FindOneUserService {
    findById(id: UUID, credentials: Credentials): ResponseModel | undefined
}
