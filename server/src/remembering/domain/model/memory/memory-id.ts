import { UUID } from '../../../../util/types'
import { Identifier } from '../../util'

export default class MemoryId extends Identifier {
    constructor (
        readonly value: UUID
    ) { super() }

    toString() {
        return this.value.toString()
    }
}
