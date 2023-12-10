export default class Moment {
    constructor(
        private readonly description: string,
    ) {
        if (description.length == 0) throw new Error('It does not makes sense to remember a moment with empty description!')
    }
    
    toString() {
        return this.description
    }
}