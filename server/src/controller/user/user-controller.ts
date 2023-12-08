import { Request, Response, Router } from "express";
import { AuthenticatorServiceImpl, BlockUserServiceImpl, DeleteMemoryServiceImpl, DeleteUserServiceImpl, FindAllUsersServiceImpl, FindOneUserServiceImpl } from "../../remembering";
import InMemoryUserRepository from "../../persistence/inmemory/user/inmemory-user-repository";
import { getCredentials } from "../shared/security/token/utils";
import JwtEncrypter from "../shared/security/token/jwt/jwt-encrypter";
import { UUIDV4 } from "../shared";
import InMemoryMemoryRepository from "../../persistence/inmemory/memory/inmemory-memory-repository";
import { BcryptedPasswordRetriever } from "../shared/security/password";

const tokenEncrypter = new JwtEncrypter()

const passwordRetriever = new BcryptedPasswordRetriever()

const userRepository = new InMemoryUserRepository()
const memoryRepository = new InMemoryMemoryRepository()

const authenticatorService = new AuthenticatorServiceImpl(userRepository)

const findAllUsersService = new FindAllUsersServiceImpl(userRepository, authenticatorService)
const findOneUserService = new FindOneUserServiceImpl(userRepository, authenticatorService)

const blockUserService = new BlockUserServiceImpl(userRepository, passwordRetriever, authenticatorService)

const deleteMemoryService = new DeleteMemoryServiceImpl(memoryRepository, authenticatorService)
const deleteUserService = new DeleteUserServiceImpl(
    userRepository,
    authenticatorService,
    deleteMemoryService,
)

const userController = Router()

userController.get('/', async (request: Request, response: Response) => {
    const credentials = await getCredentials(request, tokenEncrypter)

    if (!credentials) {
        response.status(401).send({
            cause: 'You are not authorized to access this page',
        })
        return
    }

    try {
        const users = await findAllUsersService.findAll(credentials)

        if (users.length == 0) {
            response.status(404).send({
                cause: 'There is no users that you have permission to see',
            })
            return
        }

        response.status(200).send(users)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

userController.get('/:id', async (request: Request, response: Response) => {
    const credentials = await getCredentials(request, tokenEncrypter)

    if (!credentials) {
        response.status(401).send({
            cause: 'You are not authorized to access this page',
        })
        return
    }

    try {
        const id = UUIDV4.ofString(request.params.id)
        const user = await findOneUserService.findById(id, credentials)
        
        if (!user) {
            response.status(404).send({
                cause: `A user with id: ${id.toString()} has not been found!`,
            })
            return
        }

        response.status(200).send(user)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message,
        })
    }
})

userController.patch('/:id/block', async (request: Request, response: Response) => {
    const credentials = await getCredentials(request, tokenEncrypter)

    if (!credentials) {
        response.status(401).send({
            cause: 'You are not authorized to access this page',
        })
        return
    }

    try {
        const id = UUIDV4.ofString(request.params.id)
        await blockUserService.block(id, credentials)
        response.status(200)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message,
        })
    }
})

userController.delete('/:id', async (request: Request, response: Response) => {
    const credentials = await getCredentials(request, tokenEncrypter)

    if (!credentials) {
        response.status(401).send({
            cause: 'You are not authorized to access this page',
        })
        return
    }

    try {
        const id = UUIDV4.ofString(request.params.id)
        await deleteUserService.delete(id, credentials)
        response.status(200)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

export default userController
