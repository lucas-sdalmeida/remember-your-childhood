import { UUID } from '../../../../util/types'
import { UserAccount, UserAccountId, Username } from '../../../domain/model/user'
import Email from '../../../domain/model/user/email'
import { EncryptedPassword } from '../../../domain/model/user/password'

export default interface CreateUserService {
    create(model: RequestModel): Promise<ResponseModel>
}

export type RequestModel = {
    username: string,
    email: string,
    password: string
}

export type ResponseModel = {
    id: UUID,
}

export const userFromRequestModel = (id: UUID, password: EncryptedPassword, model: RequestModel) => { 
    return new UserAccount(
        new UserAccountId(id), 
        Username.of(model.username),
        Email.of(model.email),
        password,
    )
}
