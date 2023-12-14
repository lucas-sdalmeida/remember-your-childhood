import { Request, Response, Router } from 'express'
import { LoginRequestModel, LoginServiceImpl } from '../../remembering'
import InMemoryUserRepository from '../../persistence/inmemory/user/inmemory-user-repository'
import { BcryptedPasswordChecker, BcryptedPasswordRetriever } from '../shared/security/password'
import Token from '../shared/security/token/token'
import JwtEncrypter from '../shared/security/token/jwt/jwt-encrypter'

const tokenEncrypter = new JwtEncrypter()

const userRepository = new InMemoryUserRepository()
const passwordRetriever = new BcryptedPasswordRetriever()
const passwordChecker = new BcryptedPasswordChecker()

const loginService = new LoginServiceImpl(userRepository, passwordRetriever, passwordChecker)

const loginController = Router()

loginController.get('/', async (request: Request, response: Response) => {
    const { username, email, password } = request.body

    if (!password) {
        response.status(400).send({
            cause: 'The password is a mandatory data!',
        })
        return
    }

    try {
        const credentials = await loginService.login({ username, email, password })
        const token: Token = {
            sub: credentials.userId.toString(),
            iat: credentials.loginDateTime.valueOf() / 1000,
            exp: credentials.expirationDateTime.valueOf() / 1000,
            logout: credentials.logoutDateTime ? credentials.logoutDateTime.valueOf() / 1000 : undefined,
        }

        response.status(200).send({
            token: await tokenEncrypter.encrypt(token)
        })
    }
    catch (e) {
        response.status(400).send({
            cause: e instanceof Error ? e.message : 'Something happened',
        })
    }
})

export default loginController
