import Identifier from "./identifier";

export default abstract class Entity<I extends Identifier> {
    constructor (
        public readonly id: I,
    ) {}

    equals(other: any) {
        if (!other || typeof other != typeof this) return false
        return other.id == this.id
    }
}
