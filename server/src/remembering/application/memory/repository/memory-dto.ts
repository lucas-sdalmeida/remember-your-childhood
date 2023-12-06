import { UUID } from "../../../../util/types"
import { Memory } from "../../../domain/model/memory"
import { PrivateMemory, PublicMemory, RestrictMemory } from "../../../domain/model/memory/visibility"
import BlockedMemory from "../../../domain/model/memory/visibility/blocked-memory"

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
        type = visibility.toString().split(" ")[0]
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
