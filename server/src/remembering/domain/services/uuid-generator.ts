import { UUID } from "../../../util/types";

export default interface UUIDGenerator {
    next(): Promise<UUID>
}
