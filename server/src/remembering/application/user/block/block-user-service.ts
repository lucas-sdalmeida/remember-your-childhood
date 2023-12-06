import { UUID } from "../../../../util/types";
import Credentials from "../../session/shared/credentials";

export default interface BlockUserService {
    block(blockingUserId: UUID, credentials: Credentials): void
}
