import { Notification } from '../../../../util/types'

export default class Email {
    private constructor (
        public readonly localPart: string,
        public readonly domainPart: string,
    ) {}

    static of(email: string) {
        email = email.toLowerCase()
        const splittedEmail = email.split('@')

        if (splittedEmail.length != 2) throw new Error(`A email must contain one and only one @ sign. Provided: '${email}'`)

        const notification = Email.validateLocalPart(splittedEmail[0])
        notification.copyErrors(Email.validateDomainPart(splittedEmail[1]))
        
        if (notification.hasErrors()) throw new Error(notification.message)

        return new Email(splittedEmail[0], splittedEmail[1])
    }

    private static validateLocalPart(localPart: string) {
        const notification = new Notification()

        if (localPart.match(/^[^a-z0-9]+/)) notification.addError(
            `The local part of the email must begin with a letter or a digit. Provided: ${localPart}`
        )
        if (localPart.match(/[^a-z0-9_.-]+/)) notification.addError(
            `The local part must contain only letters, digits, periods, underscores and dashes. Provided: ${localPart}`
        )
        if (localPart.match(/[^a-z0-9][_.-]+[^a-z0-9]/)) notification.addError(
            `Periods, underscores and dashes must follow and be followed by letters and digits. Provided: ${localPart}`
        )
        if (localPart.length > 64) notification.addError(
            `The local part must not exceed 64 characters long. Provided: ${localPart}`
        )

        return notification
    }

    private static validateDomainPart(domainPart: string) {
        const notification = new Notification()

        if (domainPart.length < 4) notification.addError(
            `The domain part must be at leat 4 characters long. Provided: @${domainPart}`
        )
        if (domainPart.match(/^[^a-z0-9]+.*[^a-z0-9]$/)) notification.addError(
            `The domain part must begin and end with a letter or digit. Provided: @${domainPart}`
        )
        if (domainPart.match(/[^a-z0-9.-]+/)) notification.addError(
            `Only letters, digits, periods and dashes are allowed in the domain part. Provided: @${domainPart}`
        )
        if (domainPart.match(/[^a-z0-9][.-]+[^a-z0-9]/)) notification.addError(
            `Periods and dashes must be preceeded and followed by letters and digits. Provided: @${domainPart}`
        )
        if (domainPart.match(/.+\.([a-z0-9-]|[a-z0-9-]{7,})/)) notification.addError(
            `The domain extension length must be between 2 and 6 characters. Provided: @${domainPart}`
        )
        if (domainPart.match(/(^|\.)[^.]{64,}\./)) notification.addError(
            `Each domain component cannot exceed 63 characters long. Provided: @${domainPart}`
        )
        if (domainPart.length >= 255) notification.addError(
            `The domain part cannot exceed 255 characters long. Provided: @${domainPart}`
        )

        return notification
    }

    toString() {
        return `${this.localPart}@${this.domainPart}`
    }
}