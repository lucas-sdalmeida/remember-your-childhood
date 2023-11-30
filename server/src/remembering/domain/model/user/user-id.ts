import { UUID } from "../../../../util/types"
import { Identifier } from "../../util";

export default class UserId extends Identifier {
    constructor(
        private readonly value: UUID,
    ) { super() }

    toString() {
        return this.value
    }
}
