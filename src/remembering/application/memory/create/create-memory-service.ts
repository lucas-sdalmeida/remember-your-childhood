import { UUID } from '../../../../util/types'
import { Memory, MemoryId, Moment, Rating } from '../../../domain/model/memory'
import { ReleaseDate, Subject, Title } from '../../../domain/model/memory/subject'
import { PrivateMemory, PublicMemory, RestrictMemory, Visibility } from '../../../domain/model/memory/visibility'
import BlockedMemory from '../../../domain/model/memory/visibility/blocked-memory'
import { UserAccountId } from '../../../domain/model/user'
import Credentials from '../../session/shared/credentials'

export default interface CreateMemoryService {
    create(ownerId: UUID, model: RequestModel, credentials: Credentials): Promise<ResponseModel>
}

export type RequestModel = {
    subject: {
        title: string,
        type: 'MOVIE' | 'ANIMATION' | 'BOOK' | 'HQ' | 'SERIES',
        releaseDate?: Date | string,
    },
    nostalgyLevel: number,
    affectionLevel: number,
    visibility: {
        type: string,
        target: UUID[],
    },
    moments: string[],
}


export const memoryFromRequestModel = (id: UUID, ownerId: UUID, model: RequestModel) => {
    const onwerAccountId = new UserAccountId(ownerId)

    return new Memory(
        new MemoryId(id),
        onwerAccountId,
        new Subject(
            new Title(model.subject.title),
            model.subject.type,
            model.subject.releaseDate ? ReleaseDate.of(model.subject.releaseDate) : undefined,
        ),
        Rating.ofPercentage(model.nostalgyLevel),
        Rating.ofPercentage(model.affectionLevel),
        getVisibility(onwerAccountId, model),
        model.moments.map(moment => new Moment(moment)),
    )
}

const getVisibility = (ownerId: UserAccountId, { visibility }: RequestModel) => {
    let memoVisibility: Visibility

    switch (visibility.type.toLowerCase()) {
    case 'public':
        memoVisibility = new PublicMemory(ownerId)
        break
    case 'private':
        memoVisibility = new PrivateMemory(ownerId)
        break
    case 'restrict':
        memoVisibility = new RestrictMemory(
            ownerId,
            visibility.target.map(id => new UserAccountId(id)),
        )
        break
    case 'blocked':
        memoVisibility = new BlockedMemory(
            ownerId,
            visibility.target.map(id => new UserAccountId(id)),
        )
        break
    default:
        throw new Error(`${visibility.type} is not a valid visibility!`)
    }

    return memoVisibility
}
        
export type ResponseModel = {
    id: UUID,
}
