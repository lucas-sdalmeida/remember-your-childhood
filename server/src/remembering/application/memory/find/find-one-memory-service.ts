import { UUID } from "../../../../util/types";
import Credentials from "../../session/shared/credentials";
import ResponseModel from "./response-model";

export default interface FindOneMemoryService {
    findById(memoryId: UUID, credentials: Credentials): Promise<ResponseModel | undefined>
}
