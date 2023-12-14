import { UUID } from '../../../../../util/types'
import { FollowRequest, FollowRequestId } from '../../../../domain/model/follow'
import { UserAccountId } from '../../../../domain/model/user'
import { NumericIdGenerator, PasswordRetriever } from '../../../../domain/services'
import { AuthenticatorService } from '../../../session/auth'
import Credentials from '../../../session/shared/credentials'
import { UserRepository } from '../../../user/repository'
import { userFromDTO } from '../../../user/repository/user-dto'
import { FollowRequestRepository } from '../../repository'
import { followRequestToDTO } from '../../repository/follow-request-dto'
import FollowRequestService, { ResponseModel } from '../follow-request-service'

export default class FollowRequestServiceImpl implements FollowRequestService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRequestRepository: FollowRequestRepository,
        private readonly numericIdGenerator: NumericIdGenerator,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}
    

    async follow(requestReceiver: UUID, credentials: Credentials): Promise<ResponseModel> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)
        
        if (!(await this.userRepository.existsById(requestReceiver)))
            throw new Error(`Unable to send a follow request to someone that does not exists. Provided id: ${requestReceiver.toString()}`)
        if (requestReceiver == credentials.userId)
            throw new Error(`The user ${credentials.userId.toString()} cannot follow themselves`)
        if (requester.isFollowing(new UserAccountId(requestReceiver)))
            throw new Error(`The user with id ${credentials.userId.toString()} is already following the user ${requestReceiver.toString()}`)
        if (!(await this.isAllowedToRequest(credentials.userId, requestReceiver)))
            throw new Error(`The user with id ${credentials.userId.toString()} cannot send another request to ${requestReceiver.toString()} yet!`)

        const id = await this.numericIdGenerator.next()
        const request = FollowRequest.createRequest(
            new FollowRequestId(id),
            new UserAccountId(credentials.userId),
            new UserAccountId(requestReceiver),
        )

        await this.followRequestRepository.create(followRequestToDTO(request))

        return { followRequestId: id }
    }

    private async isAllowedToRequest(requester: UUID, receiver: UUID): Promise<boolean> {
        const requests = await this.followRequestRepository.findSomeByRequesterIdAndReceiverId(requester, receiver)

        if (requests.length == 0)
            return true

        requests.sort((first, second) => first.requestDate.valueOf() - second.requestDate.valueOf())
        const lastRequest = requests[requests.length - 1]

        if (!lastRequest.anwserDate)
            return false

        return new Date().valueOf() >= lastRequest.anwserDate.valueOf() + 1000 * 3600 * 24 * 30
    }
}
