import { EncryptedPassword } from "../../../../remembering";

export default class BcryptedPassword extends EncryptedPassword {
    private constructor (
        private readonly value: string,
    ) { super() }

    static of(value: string) {
        if (!this.isValid(value))
            throw new Error(`${value} is not a valid bcrypt hashed password`)
        return new BcryptedPassword(value)
    }

    static isValid(value: string) {
        const pattern = /^\$2(a|b)\$\d{2}\$[./a-zA-Z0-9]{53}$/
        return value.match(pattern) != null
    }

    toString(): string {
        return this.value
    }
}
