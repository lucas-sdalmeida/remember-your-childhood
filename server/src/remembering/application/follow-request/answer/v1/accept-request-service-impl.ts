import { UUID } from '../../../../../util/types'
import { FollowRequest } from '../../../../domain/model/follow'
import { PasswordRetriever } from '../../../../domain/services'
import { AuthenticatorService } from '../../../session/auth'
import Credentials from '../../../session/shared/credentials'
import { UserRepository } from '../../../user/repository'
import { userFromDTO, userToDTO } from '../../../user/repository/user-dto'
import { FollowRequestRepository } from '../../repository'
import { followRequestFromDTO, followRequestToDTO } from '../../repository/follow-request-dto'
import AnswerRequestService from '../answer-request-service'

export default class AsnwerRequestServiceImpl implements AnswerRequestService {
    constructor (
        private readonly followRequestRepository: FollowRequestRepository,
        private readonly userRepository: UserRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    async accept(requestId: UUID, credentials: Credentials): Promise<void> {
        const requesterDTO = await this.authenticatorService.authenticate(credentials)
        
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)
        const request = await this.findRequest(requestId, credentials.userId)

        request.accept()
        requester.follow(request.receiver)

        await this.userRepository.create(userToDTO(requester))
        await this.followRequestRepository.create(followRequestToDTO(request))
    }

    private async findRequest(requestId: UUID, requesterId: UUID): Promise<FollowRequest> {
        const requestDTO = await this.followRequestRepository.findById(requestId)
        if (!requestDTO)
            throw new Error(`There is not a follow request with id: ${requestId.toString()}`)

        const request = followRequestFromDTO(requestDTO)
        if (requesterId != request.receiver.value)
            throw new Error(`The user with id ${requesterId.toString()} has no permission over the request ${requestId.toString()}`)

        return request
    }

    async refuse(requestId: UUID, credentials: Credentials): Promise<void> {
        await this.authenticatorService.authenticate(credentials)

        const request = await this.findRequest(requestId, credentials.userId)
        request.refuse()

        await this.followRequestRepository.create(followRequestToDTO(request))
    }
}
