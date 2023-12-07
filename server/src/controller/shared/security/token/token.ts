export default class Token {
    constructor (
        readonly sub: string,
        readonly iat: number,
        readonly exp: number,
    ) {}
}
