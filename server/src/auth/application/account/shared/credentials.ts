import { UUID } from "../../../../util/types"

type Credentials = {
    accountId: UUID,
    userId: UUID,
    loginDateTime: Date,
    expirationDateTime: Date,
    logoutDateTime?: Date,
}

export default Credentials

export const createCredentials = (accountId: UUID, userId: UUID): Credentials => {
    const loginDateTime = new Date()
    const expirationDateTime = new Date(loginDateTime)
    expirationDateTime.setHours(loginDateTime.getHours() + 4)

    return {
        accountId: accountId,
        userId: userId,
        loginDateTime: loginDateTime,
        expirationDateTime: expirationDateTime,
    }
}
