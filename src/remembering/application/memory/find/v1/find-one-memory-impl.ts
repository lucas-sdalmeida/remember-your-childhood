import { UUID } from '../../../../../util/types'
import { UserAccountId } from '../../../../domain/model/user'
import { PasswordRetriever } from '../../../../domain/services'
import { AuthenticatorService } from '../../../session/auth'
import Credentials from '../../../session/shared/credentials'
import { UserRepository } from '../../../user/repository'
import { userFromDTO } from '../../../user/repository/user-dto'
import { memoryFromDTO } from '../../repository/memory-dto'
import MemoryRepository from '../../repository/memory-repository'
import FindOneMemoryService from '../find-one-memory-service'
import ResponseModel from '../response-model'

export default class FindOneMemoryServiceImpl implements FindOneMemoryService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticator: AuthenticatorService,
    ) {}

    async findById(memoryId: UUID, credentials: Credentials): Promise<ResponseModel | undefined> {
        const requesterDTO = await this.authenticator.authenticate(credentials)
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)

        const memoryDTO = await this.memoryRepository.findById(memoryId)

        if (!memoryDTO)
            return undefined
        if (requester.hasBlocked(new UserAccountId(memoryDTO.ownerId)))
            return undefined
        
        const memory = memoryFromDTO(memoryDTO)
        if (!memory.visibility.isAllowedToSee(requester.id))
            return undefined

        return { memory: memoryDTO }
    }
}
