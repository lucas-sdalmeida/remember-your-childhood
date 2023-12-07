export default abstract class UUID {
    abstract toUnsignedIntArray(): Uint8Array

    abstract toString(): string
}
