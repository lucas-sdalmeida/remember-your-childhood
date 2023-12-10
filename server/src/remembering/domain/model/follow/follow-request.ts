import { Notification } from '../../../../util/types'
import { Entity } from '../../util'
import { UserAccountId } from '../user'
import FollowRequestId from './request-id'
import RequestStatus from './request-status'

export default class FollowRequest extends Entity<FollowRequestId> {
    private _status: RequestStatus
    private readonly _requestDate: Date
    private _answerDate?: Date

    private constructor (
        id: FollowRequestId,
        public readonly requester: UserAccountId,
        public readonly receiver: UserAccountId,
        status: RequestStatus = 'PENDING',
        requestDate = new Date(),
        answerDate?: Date,
    ) {
        super(id)
        this._status = status
        this._requestDate = requestDate
    }

    static createRequest(id: FollowRequestId, requester: UserAccountId, receiver: UserAccountId) {
        return new FollowRequest(id, requester, receiver)
    }

    static existentRequest(id: FollowRequestId, requester: UserAccountId, receiver: UserAccountId, status: RequestStatus, 
        requestDate: Date, answerDate?: Date) {
        const notification = FollowRequest.validate(status, requestDate, answerDate)
        
        if (notification.hasErrors()) throw new Error(notification.message)

        return new FollowRequest(id, requester, receiver, status, requestDate, answerDate)
    }

    private static validate(status: string, requestDate: Date, answerDate?: Date) {
        const notification = new Notification()

        if (status != 'PENDING' && !answerDate) notification.addError(
            `A request that have already been answered should have a answer date. Status: ${status}, date: ${answerDate}`
        )
        if (requestDate > new Date()) notification.addError(
            `It is not possible to a request to be made after now! Provided: ${requestDate}`
        )
        if (answerDate && answerDate > new Date()) notification.addError(
            `It is not possible to a request to be answered after now! Provided: ${answerDate}`
        )

        return notification
    }

    accept() {
        if (this._status == 'ACCEPTED') return
        if (this._status != 'PENDING') throw new Error('Unable to accept a request that has already been answered!')
    
        this._status = 'ACCEPTED'
        this._answerDate = new Date()
    }

    refuse() {
        if (this._status == 'REFUSED') return
        if (this._status != 'PENDING') throw new Error('Unable to refuse a request that has already been answered!')

        this._status = 'REFUSED'
        this._answerDate = new Date()
    }

    unfollow() {
        if (this._status != 'ACCEPTED') throw new Error('Unable to unfollow a user which request has never been accepted!')
        this._status = 'UNFOLLOWED'
        this._answerDate = new Date()
    }

    get status() {
        return this._status
    }

    get requestDate() {
        return new Date(this._requestDate)
    }

    get answerDate() {
        return this._answerDate ? new Date(this._answerDate) : undefined
    }
}
