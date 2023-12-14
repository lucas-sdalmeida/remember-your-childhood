import { UUID } from '../../../../../../util/types'
import { Rating } from '../../../../../domain/model/memory'
import { ReleaseDate, Subject, Title } from '../../../../../domain/model/memory/subject'
import { PasswordRetriever } from '../../../../../domain/services'
import { AuthenticatorService } from '../../../../session/auth'
import Credentials from '../../../../session/shared/credentials'
import { userFromDTO } from '../../../../user/repository/user-dto'
import { memoryFromDTO, memoryToDTO } from '../../../repository/memory-dto'
import MemoryRepository from '../../../repository/memory-repository'
import ResponseModel from '../../response-model'
import UpdateMemoryService, { RequestModel } from '../update-memory-service'

export default class UpdateMemoryServiceImpl implements UpdateMemoryService {
    constructor (
        private readonly memoryRepository: MemoryRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    async update(id: UUID, model: RequestModel, credentials: Credentials): Promise<ResponseModel> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)
        const memoryDTO = await this.memoryRepository.findById(id)

        if (!memoryDTO)
            throw new Error(`There is not a memory with id: ${id}`)
        
        const memory = memoryFromDTO(memoryDTO)

        if (requester.id != memory.ownerId)
            throw new Error(`The user with id ${requester.id.toString()} has no permission of editing memory ${id.toString()}`)

        const { subject, nostalgyLevel, affectionLevel } = model

        if (!subject && !nostalgyLevel && !affectionLevel)
            return { id: id }
        if (subject)
            memory.subject = new Subject(
                new Title(subject.title),
                subject.type,
                subject.releaseDate? ReleaseDate.of(subject.releaseDate) : memory.subject.releaseDate,
            )
        if (nostalgyLevel)
            memory.nostalgyLevel = Rating.ofPercentage(nostalgyLevel)
        if (affectionLevel)
            memory.affectionLevel = Rating.ofPercentage(affectionLevel)

        
        await this.memoryRepository.create(memoryToDTO(memory))
        return { id: id }
    }
}
