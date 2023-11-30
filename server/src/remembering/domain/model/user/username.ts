import { Notification } from "../../../../util/types";

export default class Username {
    private readonly value: string
    
    constructor (
        value: string,
    ) {
        this.value = value.toLowerCase()
        
        const notification = this.validate()
        if (notification.hasErrors()) throw new Error(notification.message)
    }

    private validate() {
        const notification = new Notification()
        
        if (this.value.match(/[^a-z0-9._-]*/)) notification.addError(
            `The username cannot contains symbols but letters, digits, periods, underscores and dashes! Provided: ${this.value}`
        )
        if (this.value.match(/[._-][^a-z0-9]*/)) notification.addError(
            `Periods, underscores and dashes must be followed by digits or letters in the username. Provided: ${this.value}`
        )
        if (this.value.match(/^[^a-z]+/)) notification.addError(
            `The username must begin with a letter! Provided: ${this.value}`
        )

        return notification
    }

    toString() {
        return this.value
    }
}
