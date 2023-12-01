export default abstract class Password {
    constructor (
        public readonly algorithm: string,
    ) {
        if (algorithm.trim().length == 0) throw new Error('The algorithm cannot be an empty string')
    }

    abstract toString(): string
}
