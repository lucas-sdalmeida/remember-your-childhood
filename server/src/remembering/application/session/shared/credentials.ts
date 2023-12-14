import { UUID } from '../../../../util/types'

type Credentials = {
    userId: UUID,
    loginDateTime: Date,
    expirationDateTime: Date,
    logoutDateTime?: Date,
}

export default Credentials

export const createCredentials = (userId: UUID): Credentials => {
    const loginDateTime = new Date()
    const expirationDateTime = new Date(loginDateTime)
    expirationDateTime.setHours(loginDateTime.getHours() + 4)

    return {
        userId: userId,
        loginDateTime: loginDateTime,
        expirationDateTime: expirationDateTime,
    }
}
