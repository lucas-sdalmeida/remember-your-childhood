import { UUID } from "../../../../util/types";
import FollowRequestDTO from "./follow-request-dto";

export default interface FollowRequestRepository {
    create(request: FollowRequestDTO): void

    findById(id: UUID): FollowRequestDTO | undefined

    findSomeByRequesterId(requesterId: UUID): FollowRequestDTO[]

    findSomeByRequesterIdAndReceiverId(requesterId: UUID, receiverId: UUID): FollowRequestDTO[]

    findAll(): FollowRequestDTO[]

    delete(id: UUID): void

    existsById(id: UUID): boolean
}
