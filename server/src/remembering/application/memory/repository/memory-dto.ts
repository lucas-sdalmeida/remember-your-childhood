import { UUID } from "../../../../util/types"

type MemoryDTO = {
    id: UUID,
    ownerId: UUID,
    subject: {
        title: string,
        type: 'MOVIE' | 'ANIMATION' | 'BOOK' | 'HQ' | 'SERIES',
        releaseDate: Date,
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
