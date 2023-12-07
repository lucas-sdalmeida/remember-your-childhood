import { UUID as AbstractUUID } from "../../util/types";
import { parse, v4 as uuid, validate } from 'uuid'

export default class UUIDV4 extends AbstractUUID {
    private constructor (
        private readonly value: string,
    ) {
        super()
    }

    static randomUUID() {
        return new UUIDV4(uuid())
    }

    static ofString(value: `${string}-${string}-${string}-${string}`) {
        if (!validate(value))
            throw new Error(`${value} does not represents a valid UUID`)
        return new UUIDV4(value)
    }

    toUnsignedIntArray(): Uint8Array {
        return parse(this.value)
    }

    toString(): string {
        return this.value
    }
}
