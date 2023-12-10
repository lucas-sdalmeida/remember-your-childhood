export default class Title {
    constructor(
        private readonly value: string,
    ) {
        if (value.length == 0) throw new Error('The title of a memory subject cannot be an empty string!')
    }

    toString() {
        return this.value
    }
}
