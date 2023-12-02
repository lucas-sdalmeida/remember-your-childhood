import { UUID } from "../../../../util/types"
import { UserAccount, UserAccountId, Username } from "../../../domain/model/user"
import Email from "../../../domain/model/user/email"
import { EncryptedPassword } from "../../../domain/model/user/password"
import Credentials from "../shared/credentials"

export default interface SignUpService {
    create(model: RequestModel): Credentials
}

export type RequestModel = {
    username: string,
    email: string,
    password: string
}

export const userFromRequestModel = (id: UUID, password: EncryptedPassword, model: RequestModel) => { 
    return new UserAccount(
        new UserAccountId(id), 
        Username.of(model.username),
        Email.of(model.email),
        password,
    )
}
