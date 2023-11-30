import { Entity } from "../../util";
import MemoryId from "./memory-id";
import Moment from "./moment";
import Rating from "./rating";
import { Subject } from "./subject";

export default class Memory extends Entity<MemoryId> {
    private readonly _moments: Moment[] 

    constructor(
        id: MemoryId,
        public subject: Subject,
        public nostalgyLevel: Rating,
        public affectionLevel: Rating,
        moments: Moment[] = [],
    ) {
        super(id)
        this._moments = moments
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

    get moments() {
        return this._moments.slice()
    }
}
