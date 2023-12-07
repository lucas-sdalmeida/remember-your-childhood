import { UUIDGenerator } from "../../remembering";
import { UUID } from "../../util/types";
import UUIDV4 from "./uuid-impl";

export default class UUIDGeneratorImpl implements UUIDGenerator {
    async next(): Promise<UUID> {
        return UUIDV4.randomUUID()
    }
}
