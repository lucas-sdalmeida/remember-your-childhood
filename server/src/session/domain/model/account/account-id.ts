import { UUID } from "../../../../util/types";
import { Identifier } from "../../util";

export default class AccountId extends Identifier {
    constructor(
        public readonly id: UUID,
    ) { super() }

    toString() {
        return this.id
    }
}
