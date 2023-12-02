import { UUID } from "../../../../util/types";
import { Identifier } from "../../util";

export default class AccountId extends Identifier {
    constructor(
        public readonly value: UUID,
    ) { super() }

    toString() {
        return this.value
    }
}
