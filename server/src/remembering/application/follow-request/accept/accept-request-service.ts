import { UUID } from "../../../../util/types";
import Credentials from "../../session/shared/credentials";

export default interface AcceptRequestService {
    accept(requestId: UUID, credentials: Credentials): void
}
