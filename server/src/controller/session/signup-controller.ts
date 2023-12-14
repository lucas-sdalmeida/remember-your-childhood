import { Request, Response, Router } from 'express'
import { CreateUserRequestModel, CreateUserServiceImpl, SignUpServideImpl } from '../../remembering'
import InMemoryUserRepository from '../../persistence/inmemory/user/inmemory-user-repository'
import { UUIDGeneratorImpl } from '../shared'
import { BcryptedPasswordEncrypter } from '../shared/security/password'
import Token from '../shared/security/token/token'
import JwtEncrypter from '../shared/security/token/jwt/jwt-encrypter'

const tokenEncrypter = new JwtEncrypter()
const userRepository = new InMemoryUserRepository()
const uuidGenerator = new UUIDGeneratorImpl()
const passwordEncrypter = new BcryptedPasswordEncrypter()

const createUserService = new CreateUserServiceImpl(
    userRepository,
    uuidGenerator,
    passwordEncrypter,
)
const signupService = new SignUpServideImpl(createUserService)

const signupController = Router()

signupController.post('/', async (request: Request, response: Response) => {
    const model = getRequestModel(request)

    if (!model) {
        response.status(400).send({
            cause: 'The username, e-mail or the password have not been provided. These are mandatory data!'
        })
        return
    }

    const credentials = await signupService.signup(model)
    const token: Token = {
        sub: credentials.userId.toString(),
        iat: credentials.loginDateTime.valueOf() / 1000,
        exp: credentials.expirationDateTime.valueOf() / 1000,
        logout: credentials.logoutDateTime ? credentials.logoutDateTime.valueOf() / 1000 : undefined,
    }

    response.status(201).send({
        token: await tokenEncrypter.encrypt(token),
    })
})

const getRequestModel = (request: Request): CreateUserRequestModel | undefined  => {
    const { username, email, password } = request.body

    if (!username || !email || !password)
        return undefined

    return request.body as CreateUserRequestModel
}

export default signupController
