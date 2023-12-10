import { Notification } from '../../../../util/types'

export default class Username {
    private constructor (
        private readonly value: string
    ) {}

    static of(value: string) {
        value = value.trim().toLowerCase()

        const notification = Username.validate(value)
        if (notification.hasErrors()) throw new Error(notification.message)

        return new Username(value)
    }

    private static validate(value: string) {
        const notification = new Notification()
        
        if (value.match(/[^a-z0-9._-]*/)) notification.addError(
            `The username cannot contains symbols but letters, digits, periods, underscores and dashes! Provided: ${value}`
        )
        if (value.match(/[._-][^a-z0-9]*/)) notification.addError(
            `Periods, underscores and dashes must be followed by digits or letters in the username. Provided: ${value}`
        )
        if (value.match(/^[^a-z]+/)) notification.addError(
            `The username must begin with a letter! Provided: ${value}`
        )

        return notification
    }

    toString() {
        return this.value
    }
}
