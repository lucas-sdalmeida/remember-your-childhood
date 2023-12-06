import { UUID } from "../../../../util/types";
import Credentials from "../../session/shared/credentials";

export default interface UnfollowService {
    unfollow(unfollowingUserId: UUID, credentials: Credentials): Promise<void>
}
