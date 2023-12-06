import { UUID } from "../../../../util/types";
import Credentials from "../../session/shared/credentials";

export default interface DeleteMemoryService {
    delete(id: UUID, credentials: Credentials): Promise<void>

    deleteByOwnerId(ownerId: UUID, credentials: Credentials): Promise<void>
}
