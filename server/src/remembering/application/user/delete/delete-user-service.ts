import { UUID } from "../../../../util/types";
import Credentials from "../../session/shared/credentials";

export default interface DeleteUserService {
    delete(id: UUID, credentials: Credentials): Promise<void>
}