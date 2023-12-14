import { UUID } from '../../../../../../util/types'
import { AuthenticatorService } from '../../../../session/auth'
import Credentials from '../../../../session/shared/credentials'
import { memoryFromDTO, memoryToDTO } from '../../../repository/memory-dto'
import MemoryRepository from '../../../repository/memory-repository'
import ResponseModel from '../../response-model'
import BlockEveryoneToSeeService from '../block-everyone-to-see-service'

export default class BlockEveryoneToSeeServiceImpl implements BlockEveryoneToSeeService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    async makePrivate(id: UUID, credentials: Credentials): Promise<ResponseModel> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)
        const memoryDTO = await this.memoryRepository.findById(id)

        if (!memoryDTO) throw new Error(
            `There is not a memory with id: ${id.toString()}`
        )

        const memory = memoryFromDTO(memoryDTO)

        if (memory.ownerId.value != requesterDTO.id) throw new Error(
            `The user with id ${requesterDTO.id.toString()} has not editing permissions over memory ${id.toString()}`
        )

        memory.denyToEveryoneSee()
        await this.memoryRepository.create(memoryToDTO(memory))

        return { id: id }
    }
}
