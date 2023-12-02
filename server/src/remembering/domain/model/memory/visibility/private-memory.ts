import { UserAccountId } from "../../user";
import RestrictMemory from "./restrict-memory";
import Visibility from "./visibility";

export default class PrivateMemory extends Visibility {
    protected allowsToSee(user: UserAccountId) {
        return false
    }

    grantPermissionToSee(user: UserAccountId) {
        return new RestrictMemory(this.owner, [ user ])
    }

    denyPermissionToSee(user: UserAccountId) {
        return this
    }

    toString() {
        return 'private memory'
    }
}
