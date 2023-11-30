import { Entity } from "../../util";
import UserId from "./user-id";
import Username from "./username";

export default class User extends Entity<UserId> {
    private readonly _followingList: UserId[]
    private readonly _blockList: UserId[]

    constructor (
        id: UserId,
        public readonly username: Username,
        followingList: UserId[] = [],
        blockList: UserId[] = [],
    ) {
        super(id)
        this._followingList = followingList
        this._blockList = blockList
    }

    follow(user: UserId) {
        if (this._blockList.includes(user)) throw new Error(`Unable to follow a User that is blocked! Provided: ${user}`)
        if (this.isFollowing(user)) return
        this._followingList.push(user)
    }

    isFollowing(user: UserId) {
        return this._followingList.includes(user)
    }

    unfollow(user: UserId) {
        const userIndex = this._followingList.indexOf(user)
        if (userIndex == -1) throw new Error(`Unable to unfollow a user that has never been followed! Provided: ${user}`)
        this._followingList.splice(userIndex, 1)
    }

    get followingList() {
        return this._followingList.slice()
    }

    block(user: UserId) {
        if (this.hasBlocked(user)) return
        if (this._followingList.includes(user)) this.unfollow(user)
        this._blockList.push(user)
    }

    hasBlocked(user: UserId) {
        return this._blockList.includes(user)
    }

    get blockList() {
        return this._blockList.slice()
    }
}
