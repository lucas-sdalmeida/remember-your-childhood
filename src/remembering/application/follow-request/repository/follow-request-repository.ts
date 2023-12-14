import { UUID } from '../../../../util/types'
import FollowRequestDTO from './follow-request-dto'

export default interface FollowRequestRepository {
    create(request: FollowRequestDTO): Promise<void>

    findById(id: number): Promise<FollowRequestDTO | undefined>

    findSomeByRequesterId(requesterId: UUID): Promise<FollowRequestDTO[]>

    findSomeByRequesterIdAndReceiverId(requesterId: UUID, receiverId: UUID): Promise<FollowRequestDTO[]>

    findAll(): Promise<FollowRequestDTO[]>

    delete(id: number): Promise<void>

    existsById(id: number): Promise<boolean>
}
