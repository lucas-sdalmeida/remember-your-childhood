import { UUID } from '../../../../util/types'
import { Memory, MemoryId, Moment, Rating } from '../../../domain/model/memory'
import { ReleaseDate, Subject, Title } from '../../../domain/model/memory/subject'
import { PrivateMemory, PublicMemory, RestrictMemory, Visibility } from '../../../domain/model/memory/visibility'
import BlockedMemory from '../../../domain/model/memory/visibility/blocked-memory'
import { UserAccountId } from '../../../domain/model/user'

type MemoryDTO = {
    id: UUID,
    ownerId: UUID,
    subject: {
        title: string,
        type: 'MOVIE' | 'ANIMATION' | 'BOOK' | 'HQ' | 'SERIES',
        releaseDate?: Date,
    },
    nostalgyLevel: number,
    affectionLevel: number,
    visibility: {
        type: string,
        target: UUID[],
    },
    moments: string[],
}

export default MemoryDTO

export const memoryToDTO = (memory: Memory): MemoryDTO => {
    return {
        id: memory.id.value,
        ownerId: memory.ownerId.value,
        subject: {
            title: memory.subject.title.toString(),
            type: memory.subject.type,
            releaseDate: memory.subject.releaseDate?.toDate(),
        },
        nostalgyLevel: memory.nostalgyLevel.toNumber(),
        affectionLevel: memory.affectionLevel.toNumber(),
        visibility: visibilityToDTO(memory),
        moments: memory.moments.map(moment => moment.toString()),
    }
}

const visibilityToDTO = ({ visibility }: Memory) => {
    let type: string = ''
    let target: UUID[] = []

    if (visibility instanceof PublicMemory || visibility instanceof PrivateMemory) {
        type = visibility.toString().split(' ')[0]
    }
    if (visibility instanceof RestrictMemory) {
        type = 'restrict'
        target = visibility.allowedUsers.map(id => id.value)
    }
    if (visibility instanceof BlockedMemory) {
        type = 'blocked'
        target = visibility.blockedUsers.map(id => id.value)
    }

    return {
        type: type,
        target: target,
    }
}

export const memoryFromDTO = (dto: MemoryDTO) => {
    const ownerId = new UserAccountId(dto.ownerId)

    return new Memory(
        new MemoryId(dto.id),
        ownerId,
        new Subject(
            new Title(dto.subject.title),
            dto.subject.type,
            dto.subject.releaseDate ? ReleaseDate.of(dto.subject.releaseDate) : undefined,
        ),
        Rating.ofPercentage(dto.nostalgyLevel),
        Rating.ofPercentage(dto.affectionLevel),
        visibilityFromDTO(ownerId, dto),
        dto.moments.map(moment => new Moment(moment)),
    )
}

const visibilityFromDTO = (ownerId: UserAccountId, { visibility }: MemoryDTO) => {
    let memoVisibility: Visibility

    switch (visibility.type) {
    case 'public':
        memoVisibility = new PublicMemory(ownerId)
        break
    case 'private':
        memoVisibility = new PrivateMemory(ownerId)
    case 'restrict':
        memoVisibility = new RestrictMemory(
            ownerId,
            visibility.target.map(id => new UserAccountId(id)),
        )
        break
    case 'blocked':
        memoVisibility = new BlockedMemory(
            ownerId,
            visibility.target.map(id => new UserAccountId(id))
        )
        break
    default:
        throw new Error(`Invalid visibility type ${ visibility.type }`)
    }

    return memoVisibility
}
