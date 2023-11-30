import { UserId } from "../../user";
import RestrictMemory from "./restrict-memory";
import Visibility from "./visibility";

export default class PrivateMemory extends Visibility {
    protected allowsToSee(user: UserId) {
        return false
    }

    grantPermissionToSee(user: UserId) {
        return new RestrictMemory(this.owner, [ user ])
    }

    denyPermissionToSee(user: UserId) {
        return this
    }

    toString() {
        return 'private memory'
    }
}
