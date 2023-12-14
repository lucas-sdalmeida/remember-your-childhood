export default class ReleaseDate {
    private constructor (
        private readonly value: Date,
    ) {}

    static of(value: Date | string) {
        const date = value instanceof Date ? value : new Date(value)

        if (date.valueOf() >= new Date().valueOf()) 
            throw new Error(`It is impossible to the memory subject to be released after now. Provided: ${value}`)

        return new ReleaseDate(date)
    }

    toDate() {
        return new Date(this.value)
    }

    toString() {
        return this.value.toISOString()
    }
}
