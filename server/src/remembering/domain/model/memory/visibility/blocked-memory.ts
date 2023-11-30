import { UserId } from "../../user";
import Visibility from "./visibility";

export default class BlockedMemory extends Visibility {
    constructor (
        owner: UserId,
        private readonly blockedUsers: UserId[],
    ) { super(owner) }

    protected allowsToSee(user: UserId) {
        return !this.blockedUsers.includes(user)
    }

    grantPermissionToSee(user: UserId) {
        const userIndex = this.blockedUsers.indexOf(user)
        
        if (userIndex == -1) return this
        
        this.blockedUsers.splice(userIndex, 1)
        return this
    }

    denyPermissionToSee(user: UserId) {
        if (!this.allowsToSee(user)) return this
        this.blockedUsers.push(user)
        return this
    }

    toString() {
        return `blocked memory for ${this.blockedUsers}`
    }
}
