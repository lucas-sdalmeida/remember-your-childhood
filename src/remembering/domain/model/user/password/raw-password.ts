import { Notification } from '../../../../../util/types'

export default class RawPassword {
    private constructor (
        private readonly value: string,
    ) {}

    static of(rawPassword: string) {
        const notification = RawPassword.validate(rawPassword)
        if (notification.hasErrors()) throw new Error(notification.message)
        return new RawPassword(rawPassword)
    }

    private static validate(rawPassword: string) {
        const notification = new Notification()

        if (rawPassword.length < 8) 
            notification.addError(`The password must contain at leat 8 charatecters. Provided: ${rawPassword}`)
        if (rawPassword.match(/^[^A-Z ]+$/))
            notification.addError(`The password must containt at least a uppercase letter. Provided: ${rawPassword}`)
        if (rawPassword.match(/^[^a-z ]+$/))
            notification.addError(`The password must contain at least a lower case letters. Provided: ${rawPassword}`)
        if (rawPassword.match(/^[^0-9 ]+$/))
            notification.addError(`The password must contain at least a number. Provided: ${rawPassword}`)
        if (rawPassword.match(/\s+/))
            notification.addError(`The password cannot contain blank spaces. Provided: ${rawPassword}`)

        return notification
    }

    toString() {
        return this.value
    }
}
