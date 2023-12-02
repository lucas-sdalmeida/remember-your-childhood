import { Entity } from "../../util";
import Email from "./email";
import { Password } from "./password";
import UserAccountId from "./user-id";
import Username from "./username";

export default class UserAccount extends Entity<UserAccountId> {
    private readonly _followingList: UserAccountId[]
    private readonly _blockList: UserAccountId[]

    constructor (
        id: UserAccountId,
        public readonly username: Username,
        public readonly email: Email,
        public readonly password: Password,
        followingList: UserAccountId[] = [],
        blockList: UserAccountId[] = [],
    ) {
        super(id)
        this._followingList = followingList
        this._blockList = blockList
    }

    follow(user: UserAccountId) {
        if (this._blockList.includes(user)) throw new Error(`Unable to follow a User that is blocked! Provided: ${user}`)
        if (this.isFollowing(user)) return
        this._followingList.push(user)
    }

    isFollowing(user: UserAccountId) {
        return this._followingList.includes(user)
    }

    unfollow(user: UserAccountId) {
        const userIndex = this._followingList.indexOf(user)
        if (userIndex == -1) throw new Error(`Unable to unfollow a user that has never been followed! Provided: ${user}`)
        this._followingList.splice(userIndex, 1)
    }

    get followingList() {
        return this._followingList.slice()
    }

    block(user: UserAccountId) {
        if (this.hasBlocked(user)) return
        if (this._followingList.includes(user)) this.unfollow(user)
        this._blockList.push(user)
    }

    hasBlocked(user: UserAccountId) {
        return this._blockList.includes(user)
    }

    get blockList() {
        return this._blockList.slice()
    }
}
