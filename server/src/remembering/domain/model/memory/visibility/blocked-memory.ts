import { UserAccountId } from "../../user";
import Visibility from "./visibility";

export default class BlockedMemory extends Visibility {
    constructor (
        owner: UserAccountId,
        private readonly blockedUsers: UserAccountId[],
    ) { super(owner) }

    protected allowsToSee(user: UserAccountId) {
        return !this.blockedUsers.includes(user)
    }

    grantPermissionToSee(user: UserAccountId) {
        const userIndex = this.blockedUsers.indexOf(user)
        
        if (userIndex == -1) return this
        
        this.blockedUsers.splice(userIndex, 1)
        return this
    }

    denyPermissionToSee(user: UserAccountId) {
        if (!this.allowsToSee(user)) return this
        this.blockedUsers.push(user)
        return this
    }

    toString() {
        return `blocked memory for ${this.blockedUsers}`
    }
}
