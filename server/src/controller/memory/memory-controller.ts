import { NextFunction, Request, Response, Router } from "express";
import { AddMomentServiceImpl, AllowEveryoneToSeeServiceImpl, AllowUserToSeeServiceImpl, AuthenticatorServiceImpl, BlockEveryoneToSeeServiceImpl, BlockUserToSeeServiceImpl, CreateMemoryServiceImpl, Credentials, DeleteMemoryServiceImpl, FindAllMemoriesServiceImpl, FindOneMemoryServiceImpl, UpdateMemoryServiceImpl } from "../../remembering";
import { getCredentials } from "../shared/security/token/utils";
import JwtEncrypter from "../shared/security/token/jwt/jwt-encrypter";
import InMemoryUserRepository from "../../persistence/inmemory/user/inmemory-user-repository";
import InMemoryMemoryRepository from "../../persistence/inmemory/memory/inmemory-memory-repository";
import { UUIDGeneratorImpl, UUIDV4 } from "../shared";
import { getCreateMemoryRequestModel, getUpdateMemoryRequestModel } from "./utils";
import { Notification } from "../../util/types";
import { BcryptedPasswordRetriever } from "../shared/security/password";

const tokenEncrypter = new JwtEncrypter()

const userRepository = new InMemoryUserRepository()
const memoryRepository = new InMemoryMemoryRepository()

const uuidGenerator = new UUIDGeneratorImpl()
const passwordRetriever = new BcryptedPasswordRetriever()

const authenticatorService = new AuthenticatorServiceImpl(userRepository)

const createMemoryService = new CreateMemoryServiceImpl(
    memoryRepository,
    userRepository,
    uuidGenerator,
    authenticatorService,
)

const findOneMemoryService = new FindOneMemoryServiceImpl(
    memoryRepository,
    passwordRetriever,
    authenticatorService,
)
const findAllMemoriesService = new FindAllMemoriesServiceImpl(
    memoryRepository,
    passwordRetriever,
    authenticatorService,
)

const updateMemoryService = new UpdateMemoryServiceImpl(
    memoryRepository,
    passwordRetriever,
    authenticatorService
)

const allowEveryoneToSeeService = new AllowEveryoneToSeeServiceImpl(
    memoryRepository,
    authenticatorService,
)

const blockEveryoneToSeeService = new BlockEveryoneToSeeServiceImpl(
    memoryRepository,
    authenticatorService,
)

const allowUserToSeeService = new AllowUserToSeeServiceImpl(
    memoryRepository,
    userRepository,
    passwordRetriever,
    authenticatorService,
)

const blockUserToSeeService = new BlockUserToSeeServiceImpl(
    memoryRepository,
    userRepository,
    passwordRetriever,
    authenticatorService,
)

const addMomentService = new AddMomentServiceImpl(
    memoryRepository,
    passwordRetriever,
    authenticatorService,
)

const deleteMemoryService = new DeleteMemoryServiceImpl(
    memoryRepository,
    authenticatorService,
)

const memoryController = Router()
let credentials: Credentials


memoryController.use('/', async (request: Request, response: Response, next: NextFunction) => {
    const possibleCredentials = await getCredentials(request, tokenEncrypter)

    if (possibleCredentials) {
        credentials = possibleCredentials
        next()
        return
    }

    response.status(401).send({
        cause: 'You don\'t have a access token, so you are not authorized to access this operation!'
    })
})

memoryController.post('/user/:userId', async (request: Request, response: Response) => {
    try {
        const ownerId = UUIDV4.ofString(request.params.userId)
        const requestModel = getCreateMemoryRequestModel(request)

        if (requestModel instanceof Notification) {
            response.status(400).send({ cause: requestModel.message })
            return
        }

        const responseModel = await createMemoryService.create(ownerId, requestModel, credentials)
        response.status(201).send(requestModel)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

memoryController.get('/', async (requestModel: Request, response: Response) => {
    try {
        const responseModel = await findAllMemoriesService.findAll(credentials)

        if (responseModel.length == 0) {
            response.status(404).send({
                cause: `There is no memories you can see`,
            })
        }
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message,
        })
    }
})

memoryController.get('/:id', async (request: Request, response: Response) => {
    try {
        const id = UUIDV4.ofString(request.params.id)
        const responseModel = await findOneMemoryService.findById(id, credentials)

        if (!responseModel) {
            response.status(404).send({ cause: `There is not a memory with id: ${id.toString()}` })
            return
        }

        response.status(200).send(responseModel)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

memoryController.put('/:id', async (request: Request, response: Response) => {
    try {
        const id = UUIDV4.ofString(request.params.id)
        const requestModel = getUpdateMemoryRequestModel(request)

        if (requestModel instanceof Notification) {
            response.status(404).send({ cause: requestModel.message })
            return
        }

        await updateMemoryService.update(id, requestModel, credentials)
        response.status(200)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

memoryController.patch('/:id/visibility/public', async (request: Request, response: Response) => {
    try {
        const id = UUIDV4.ofString(request.params.id)
        await allowEveryoneToSeeService.makePublic(id, credentials)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

memoryController.patch('/:id/visibility/private', async (request: Request, response: Response) => {
    try {
        const id = UUIDV4.ofString(request.params.id)
        await blockEveryoneToSeeService.makePrivate(id, credentials)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

memoryController.patch('/:id/visibility/allow/:userId', async (request: Request, response: Response) => {
    try {
        const id = UUIDV4.ofString(request.params.id)
        const userId = UUIDV4.ofString(request.params.userId)
        await allowUserToSeeService.allowUser(id, userId, credentials)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

memoryController.patch('/:id/visibility/block/:userId', async (request: Request, response: Response) => {
    try {
        const id = UUIDV4.ofString(request.params.id)
        const userId = UUIDV4.ofString(request.params.userId)
        await blockUserToSeeService.blockUser(id, userId, credentials)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

memoryController.patch('/:id/moment', async (request: Request, response: Response) => {
    try {
        const id = UUIDV4.ofString(request.params.id)
        const { description } = request.body

        if (!description || typeof description != 'string') {
            response.status(400).send({ cause: `The description of the memory must be given and must be a string!`})
            return
        }

        await addMomentService.add(id, { description: description }, credentials)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message
        })
    }
})

memoryController.delete('/:id', async (request: Request, response: Response) => {
    try {
        const id = UUIDV4.ofString(request.params.id)
        await deleteMemoryService.delete(id, credentials)
        response.status(200)
    }
    catch (e) {
        response.status(400).send({
            cause: (e as Error).message,
        })
    }
})

export default memoryController
