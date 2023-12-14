import { Notification } from '../../../../util/types'

export default class Rating {
    private constructor (
        private readonly value: number
    ) {}

    static ofPercentage(value: number) {
        value = Math.trunc(value)

        const notification = this.validate(value)
        if (notification.hasErrors()) throw new Error(notification.message)

        return new Rating(value)
    }

    private static validate(value: number) {
        const notification = new Notification()

        if (value < 0)
            notification.addError(`A rating cannot be a negative number. Provided: ${value}`)
        if (value > 100)
            notification.addError(`A rating cannot exceed 100%. Provided: ${value}`)

        return notification
    }

    static ofDecimal(value: number) {
        return this.ofPercentage(value * 100)
    }

    toString() {
        return `${this.value}`
    }

    toNumber() {
        return this.value
    }
}
