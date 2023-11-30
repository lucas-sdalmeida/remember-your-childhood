import { UserId } from "../../user";
import Visibility from "./visibility";

export default class RestrictMemory extends Visibility {
    constructor (
        ownerId: UserId,
        private readonly allowedUsers: UserId[],
    ) { super(ownerId) }

    protected allowsToSee(user: UserId) {
        return this.allowedUsers.includes(user)
    }

    grantPermissionToSee(user: UserId) {
        if (this.allowsToSee(user)) return this
        this.allowedUsers.push(user)
        return this
    }

    denyPermissionToSee(user: UserId) {
        const userIndex = this.allowedUsers.indexOf(user)
        
        if (userIndex == -1) return this

        this.allowedUsers.splice(userIndex, 1)
        return this
    }

    toString() {
        return `retricted memory to ${this.allowedUsers}`
    }
}
