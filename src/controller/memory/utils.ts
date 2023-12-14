import { Request } from 'express'
import { CreateMemoryRequestModel, UpdateMemoryRequestModel } from '../../remembering'
import { Notification, UUID } from '../../util/types'
import { UUIDV4 } from '../shared'

export const getCreateMemoryRequestModel = (request: Request): CreateMemoryRequestModel | Notification => {
    const notification = new Notification()
    const subject = getSubject(request)
    const nostalgyLevel = getNostalgyLevel(request)
    const affectionLevel = getAffectionLevel(request)
    const visibility = getVisibility(request)
    const moments = getMoments(request)

    if (subject instanceof Notification)
        notification.copyErrors(subject)
    if (nostalgyLevel instanceof Notification)
        notification.copyErrors(nostalgyLevel)
    if (affectionLevel instanceof Notification)
        notification.copyErrors(affectionLevel)
    if (visibility instanceof Notification)
        notification.copyErrors(visibility)
    if (moments instanceof Notification)
        notification.copyErrors(moments)

    return notification.hasErrors() ? notification : {
        subject: subject as { title: string, type: 'MOVIE' | 'ANIMATION' | 'BOOK' | 'HQ' | 'SERIES', releaseDate?: Date },
        nostalgyLevel: nostalgyLevel as number,
        affectionLevel: affectionLevel as number,
        visibility: visibility as { type: string, target: UUID[] },
        moments: moments as string[],
    }
}

export const getUpdateMemoryRequestModel = (request: Request): UpdateMemoryRequestModel | Notification => {
    const notification = new Notification()
    const subject = getSubject(request)
    const nostalgyLevel = getNostalgyLevel(request)
    const affectionLevel = getAffectionLevel(request)

    if (subject instanceof Notification)
        notification.copyErrors(subject)
    if (nostalgyLevel instanceof Notification)
        notification.copyErrors(nostalgyLevel)
    if (affectionLevel instanceof Notification)
        notification.copyErrors(affectionLevel)

    return notification.hasErrors() ? notification : {
        subject: subject as { title: string, type: 'MOVIE' | 'ANIMATION' | 'BOOK' | 'HQ' | 'SERIES', releaseDate: Date },
        nostalgyLevel: nostalgyLevel as number,
        affectionLevel: affectionLevel as number,
    }
}

const getSubject = (request: Request) => {
    const notification = new Notification()
    const { subject } = request.body

    if (!subject) {
        notification.addError('The memory subject must be given!')
        return notification
    }

    if (!subject.title || typeof subject.title != 'string') {
        notification.addError(`The subject's title must be a string value! Provided: ${subject.title}`)
    }
    if (!subject.type || !['MOVIE', 'ANIMATION', 'BOOK', 'HQ', 'SERIES'].includes(typeof subject.type)) {
        notification.addError(`The subject's type must be 'MOVIE', 'ANIMATION', 'BOOK', 'HQ' or 'SERIES'. Provided: ${subject.type}`)
    }
    if (subject.releaseDate && isNaN(new Date(subject.releaseDate).getTime())) {
        notification.addError('If the subject release is provided, it must be a valid ISO formatted date string! Provided' + 
            ` ${subject.releaseDate}`)
    }
    if (notification.hasErrors()) return notification

    return {
        title: subject.title as string,
        type: subject.type as 'MOVIE' | 'ANIMATION' | 'BOOK' | 'HQ' | 'SERIES',
        releaseDate: subject.releaseDate ? new Date(subject.releaseDate) : undefined,
    }
}

const getNostalgyLevel = (request: Request) => {
    const notification = new Notification()
    const { nostalgyLevel } = request.body

    if (!nostalgyLevel) {
        notification.addError('The nostalgy level must be given!')
        return notification
    }
    if (typeof nostalgyLevel != 'number') {
        nostalgyLevel.addError(`The nostalgy level must be a numeric value. Provided: ${nostalgyLevel}`)
    }
    
    return notification.hasErrors() ? notification : nostalgyLevel as number
}

const getAffectionLevel = (request: Request) => {
    const notification = new Notification()
    const { affectionLevel } = request.body

    if (!affectionLevel) {
        notification.addError('The affection level must be given')
        return notification
    }
    if (typeof affectionLevel != 'number') {
        notification.addError(`The affection level must be a numeric value. Provided: ${affectionLevel}`)
    }

    return notification.hasErrors() ? notification : affectionLevel as number
}

const getVisibility = (request: Request) => {
    const notification = new Notification()
    const { visibility } = request.body

    if (!visibility) {
        notification.addError('The visibility must be given!')
        return notification
    }
    if (!visibility.type || typeof visibility.type != 'string') {
        notification.addError(`The type of the visibility must be given and must be a string. Provided: ${visibility.target}`)
    }
    if (visibility.target && !isStringArray(visibility.target)) {
        notification.addError(`The visibility target must be a array of strings. Provided: ${visibility.target}`)
    }

    return notification.hasErrors() ? notification : {
        type: visibility.type as string,
        target: visibility.target ? (visibility.target as string[]).map(t => UUIDV4.ofString(t)) : [],
    }
}

const isStringArray = (array: any): array is string[] => {
    if (!Array.isArray(array)) return false
    return array.every(i => typeof i == 'string')
}

const getMoments = (request: Request) => {
    const notification = new Notification()
    const { moments } = request.body

    if (!moments) {
        return [] as string[]
    }
    if (!isStringArray(moments)) {
        notification.addError(`If the moments are given, they all must be strings. Provided: ${moments}`)
    }

    return notification.hasErrors() ? notification : moments as string[]
}
