import { UUID } from "../../../../../util/types"
import Credentials from "../../../session/shared/credentials"
import ResponseModel from "../response-model"

export default interface UpdateMemoryService {
    update(id: UUID, model: RequestModel, credentials: Credentials): ResponseModel
}

export type RequestModel = {
    subject?: {
        title: string,
        type: 'MOVIE' | 'ANIMATION' | 'BOOK' | 'HQ' | 'SERIES',
        releaseDate?: Date,
    },
    nostalgyLevel?: number,
    affectionLevel?: number,
}
