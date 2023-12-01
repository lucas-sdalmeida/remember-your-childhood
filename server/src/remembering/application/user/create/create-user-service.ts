import { UUID } from "../../../../util/types"
import { User, UserId, Username } from "../../../domain/model/user"

export default interface CreateUserService {
    create(model: RequestModel): ResponseModel
}

export type RequestModel = {
    username: string,
}

export const userFromRequestModel = (id: UUID, model: RequestModel) => new User(new UserId(id), Username.of(model.username))

export type ResponseModel = {
    id: UUID,
}
