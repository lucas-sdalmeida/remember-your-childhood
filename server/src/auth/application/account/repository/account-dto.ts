import { UUID } from "../../../../util/types"

type AccountDto = {
    id: UUID,
    userId: UUID,
    email: string,
    password: string,
}

export default AccountDto
