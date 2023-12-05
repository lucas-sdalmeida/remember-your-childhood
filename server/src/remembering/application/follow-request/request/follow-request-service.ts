import { UUID } from "../../../../util/types";
import Credentials from "../../session/shared/credentials";

export default interface FollowRequestService {
    follow(requestReceiver: UUID, credentials: Credentials): ResponseModel
}

export type ResponseModel = {
    followRequestId: number,
}
