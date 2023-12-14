import { UUID } from '../../../../../util/types'
import { AuthenticatorService } from '../../../session/auth'
import Credentials from '../../../session/shared/credentials'
import { memoryFromDTO } from '../../repository/memory-dto'
import MemoryRepository from '../../repository/memory-repository'
import DeleteMemoryService from '../delete-memory-service'

export default class DeleteMemoryServiceImpl implements DeleteMemoryService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly authenticatorService: AuthenticatorService,
    ) {}    
    
    async delete(id: UUID, credentials: Credentials): Promise<void> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)
        const memoryDTO = await this.memoryRepository.findById(id)

        if (!memoryDTO) throw new Error(
            `There is not a memory with id: ${id.toString()}`
        )

        const memory = memoryFromDTO(memoryDTO)

        if (memory.ownerId.value != requesterDTO.id) throw new Error(
            `The user with id ${requesterDTO.id.toString()} does not have deleting permissions on memory ${id.toString()}`
        )

        await this.memoryRepository.delete(id)
    }

    async deleteByOwnerId(ownerId: UUID, credentials: Credentials): Promise<void> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)

        if (requesterDTO.id != ownerId) throw new Error(
            `The user ${requesterDTO.id.toString()} does not have deleting permissions on memories of user ${ownerId.toString()}`
        )

        await this.memoryRepository.deleteByOnwerId(ownerId)
    }
}
