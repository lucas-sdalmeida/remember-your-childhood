import { CreateUserRequestModel } from "../../../../remembering"
import { UUID } from "../../../../util/types"
import { Account, AccountId } from "../../../domain/model/account"
import { EncryptedPassword } from "../../../domain/model/account/password"
import Credentials from "../shared/credentials"

export default interface SignUpService {
    signup(model: RequestModel): Credentials
}

export type RequestModel = {
    email: string,
    rawPassword: string,
    userRequestModel: CreateUserRequestModel,
}
