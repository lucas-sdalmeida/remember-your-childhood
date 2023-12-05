import { UUID } from "../../../../util/types"
import { FollowRequest } from "../../../domain/model/follow"

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
