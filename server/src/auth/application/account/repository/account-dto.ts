import { UUID } from "../../../../util/types"
import { Account } from "../../../domain/model/account"

type AccountDto = {
    id: UUID,
    userId: UUID,
    email: string,
    password: string,
}

export default AccountDto

export const accountToDTO = (account: Account): AccountDto => {
    return {
        id: account.id.value,
        userId: account.userId.value,
        email: account.email.toString(),
        password: account.password.toString(),
    }
}
