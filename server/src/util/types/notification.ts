export default class Notification {
    private readonly errors: Message[] = []

    addError(message: string, cause?: Error) {
        this.errors.push({ value: message, cause: cause })
    }

    copyErrors(other: Notification) {
        if (other.errors.length > this.errors.length) {
            this.errors.forEach(e => other.addError(e.value, e.cause))
            return other
        }
        other.errors.forEach(e => this.addError(e.value, e.cause))
        return this
    }

    hasNoErrors() {
        return !this.hasErrors()
    }

    hasErrors() {
        return this.errors.length > 0
    }

    get message() {
        return this.errors.map(m => m.value)
            .reduce((previous, current) => previous + ' | ' + current)
    }
}

type Message = { value: string, cause?: Error }
