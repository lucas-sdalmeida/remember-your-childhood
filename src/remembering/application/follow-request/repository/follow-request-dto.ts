import { UUID } from '../../../../util/types'
import { FollowRequest, FollowRequestId } from '../../../domain/model/follow'
import { UserAccountId } from '../../../domain/model/user'

type FollowRequestDTO = {
    id: number,
    requesterId: UUID,
    receiverId: UUID,
    status: 'PENDING' | 'ACCEPTED' | 'REFUSED' | 'UNFOLLOWED',
    requestDate: Date,
    anwserDate?: Date,
}

export default FollowRequestDTO

export const followRequestToDTO = (followRequest: FollowRequest): FollowRequestDTO => {
    return {
        id: followRequest.id.value,
        requesterId: followRequest.requester.value,
        receiverId: followRequest.receiver.value,
        status: followRequest.status,
        requestDate: followRequest.requestDate,
        anwserDate: followRequest.answerDate,
    }
}

export const followRequestFromDTO = (dto: FollowRequestDTO) => {
    return FollowRequest.existentRequest(
        new FollowRequestId(dto.id), 
        new UserAccountId(dto.requesterId), 
        new UserAccountId(dto.receiverId), 
        dto.status,
        dto.requestDate,
        dto.anwserDate
    )
}
