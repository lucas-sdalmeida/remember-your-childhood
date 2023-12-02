import { UserAccountId } from "../../user";
import Visibility from "./visibility";

export default class RestrictMemory extends Visibility {
    constructor (
        ownerId: UserAccountId,
        private readonly allowedUsers: UserAccountId[],
    ) { super(ownerId) }

    protected allowsToSee(user: UserAccountId) {
        return this.allowedUsers.includes(user)
    }

    grantPermissionToSee(user: UserAccountId) {
        if (this.allowsToSee(user)) return this
        this.allowedUsers.push(user)
        return this
    }

    denyPermissionToSee(user: UserAccountId) {
        const userIndex = this.allowedUsers.indexOf(user)
        
        if (userIndex == -1) return this

        this.allowedUsers.splice(userIndex, 1)
        return this
    }

    toString() {
        return `retricted memory to ${this.allowedUsers}`
    }
}
