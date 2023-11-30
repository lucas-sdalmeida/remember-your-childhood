import { Notification } from "../../../../util/types"

export default class Rating {
    private readonly value: number
    constructor (
        value: number
    ) {
        this.value = Math.trunc(value)
        
        const notification = this.validate()
        if (notification.hasErrors()) throw new Error(notification.message)
    }

    private validate() {
        const notification = new Notification()

        if (this.value < 0)
            notification.addError(`A rating cannot be a negative number. Provided: ${this.value}`)
        if (this.value > 100)
            notification.addError(`A rating cannot exceed 100%. Provided: ${this.value}`)

        return notification
    }

    toString() {
        return `${this.value}`
    }
}
