import { UserAccountId } from "../../user";
import Visibility from "./visibility";

export default class RestrictMemory extends Visibility {
    private readonly _allowedUsers: UserAccountId[]

    constructor (
        ownerId: UserAccountId,
        allowedUsers: UserAccountId[],
    ) { 
        super(ownerId) 
        this._allowedUsers = allowedUsers
    }

    protected allowsToSee(user: UserAccountId) {
        return this._allowedUsers.includes(user)
    }

    grantPermissionToSee(user: UserAccountId) {
        if (this.allowsToSee(user)) return this
        this._allowedUsers.push(user)
        return this
    }

    denyPermissionToSee(user: UserAccountId) {
        const userIndex = this._allowedUsers.indexOf(user)
        
        if (userIndex == -1) return this

        this._allowedUsers.splice(userIndex, 1)
        return this
    }

    get allowedUsers() {
        return this._allowedUsers.slice()
    }

    toString() {
        return `retricted memory to ${this._allowedUsers}`
    }
}
