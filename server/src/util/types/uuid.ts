export default abstract class UUID {
    constructor (
        readonly value: Uint8Array,
    ) {}

    abstract toString(): string
}
