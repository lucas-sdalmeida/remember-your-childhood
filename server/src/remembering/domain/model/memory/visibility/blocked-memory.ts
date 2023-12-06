import { UserAccountId } from "../../user";
import Visibility from "./visibility";

export default class BlockedMemory extends Visibility {
    private readonly _blockedUsers: UserAccountId[]

    constructor (
        owner: UserAccountId,
        blockedUsers: UserAccountId[],
    ) { 
        super(owner) 
        this._blockedUsers = blockedUsers
    }

    protected allowsToSee(user: UserAccountId) {
        return !this._blockedUsers.includes(user)
    }

    grantPermissionToSee(user: UserAccountId) {
        const userIndex = this._blockedUsers.indexOf(user)
        
        if (userIndex == -1) return this
        
        this._blockedUsers.splice(userIndex, 1)
        return this
    }

    denyPermissionToSee(user: UserAccountId) {
        if (!this.allowsToSee(user)) return this
        this._blockedUsers.push(user)
        return this
    }

    get blockedUsers() {
        return this._blockedUsers.slice()
    }

    toString() {
        return `blocked memory for ${this._blockedUsers}`
    }
}
