import Identifier from './identifier'

export default abstract class Entity<I extends Identifier> {
    constructor (
        public readonly id: I,
    ) {}

    equals(other: unknown) {
        if (!other || !(other instanceof Entity)) return false
        return this.id.equals(other.id)
    }
}
