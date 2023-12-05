import { UUID } from "../../../../util/types";
import { Identifier } from "../../util";

export default class FollowRequestId extends Identifier {
    constructor (
        readonly value: number,
    ) { super() }

    toString() {
        return this.value.toString()
    }
}
