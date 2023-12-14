import { UUID } from '../../../../../../util/types'
import { AuthenticatorService } from '../../../../session/auth'
import Credentials from '../../../../session/shared/credentials'
import { memoryFromDTO, memoryToDTO } from '../../../repository/memory-dto'
import MemoryRepository from '../../../repository/memory-repository'
import ResponseModel from '../../response-model'
import AllowToEveryoneSeeService from '../allow-everyone-to-see-service'

export default class AllowEveryoneToSeeServiceImpl implements AllowToEveryoneSeeService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    async makePublic(id: UUID, credentials: Credentials): Promise<ResponseModel> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)
        const memoryDTO = await this.memoryRepository.findById(id)

        if (!memoryDTO) throw new Error(
            `There is not a memory with id: ${memoryDTO}`
        )

        const memory = memoryFromDTO(memoryDTO)

        if (memory.ownerId.value != requesterDTO.id) throw new Error(
            `The user with id ${requesterDTO.id.toString()} has not editing permission over memory ${memory.id.toString()}`
        )

        memory.allowToPublicSee()
        await this.memoryRepository.create(memoryToDTO(memory))

        return { id: id }
    }
}
