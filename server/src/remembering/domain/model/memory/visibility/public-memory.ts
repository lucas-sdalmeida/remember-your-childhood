import { UserId } from "../../user";
import BlockedMemory from "./blocked-memory";
import RestrictMemory from "./restrict-memory";
import Visibility from "./visibility";

export default class PublicMemory extends Visibility {
    protected allowsToSee(user: UserId) {
        return true
    }

    grantPermissionToSee(user: UserId) {
        return new RestrictMemory(this.owner, [ user ])
    }

    denyPermissionToSee(user: UserId) {
        return new BlockedMemory(this.owner, [ user ])
    }

    toString() {
        return 'public memory'
    }
}
