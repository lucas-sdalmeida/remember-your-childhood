import { Entity } from "../../util";
import { UserId } from "../user";
import MemoryId from "./memory-id";
import Moment from "./moment";
import Rating from "./rating";
import { Subject } from "./subject";
import { PrivateMemory, PublicMemory, RestrictMemory, Visibility } from "./visibility";

export default class Memory extends Entity<MemoryId> {
    private readonly _moments: Moment[] 
    private _visibility: Visibility

    constructor(
        id: MemoryId,
        public readonly ownerId: UserId,
        public subject: Subject,
        public nostalgyLevel: Rating,
        public affectionLevel: Rating,
        visibility: Visibility,
        moments: Moment[] = [],
    ) {
        super(id)
        this._moments = moments
        this._visibility = visibility
    }

    rememberMoment(moment: Moment) {
        if (this.moments.includes(moment)) return
        this.moments.push(moment);
    }

    forgetMoment(moment: Moment) {
        const momentIndex = this._moments.indexOf(moment)
        
        if (momentIndex == -1) 
            throw Error(`Cannot forget a moment that has never been remembered. Provided: ${moment.toString()}`)
        
        this._moments.splice(momentIndex, 1)
    }

    allowToPublicSee() {
        this._visibility = new PublicMemory(this.ownerId)
    }

    denyToEveryoneSee() {
        this._visibility = new PrivateMemory(this.ownerId)
    }

    grantPermissionToSee(user: UserId, ...others: UserId[]) {
        this._visibility = this._visibility.grantPermissionToSee(user)
        others.forEach(u => this._visibility.grantPermissionToSee(u))
    }

    revokePermissionToSee(user: UserId, ...others: UserId[]) {
        this._visibility = this._visibility.denyPermissionToSee(user)
        others.forEach(u => this._visibility.denyPermissionToSee(u))
    }

    get moments() {
        return this._moments.slice()
    }

    get visibility() {
        return this._visibility
    }
}
