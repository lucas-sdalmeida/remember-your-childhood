import { UUID } from "../../../../../util/types";
import { FollowRequest } from "../../../../domain/model/follow";
import { PasswordRetriever } from "../../../../domain/services";
import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { UserRepository } from "../../../user/repository";
import { userFromDTO, userToDTO } from "../../../user/repository/user-dto";
import { FollowRequestRepository } from "../../repository";
import { followRequestFromDTO, followRequestToDTO } from "../../repository/follow-request-dto";
import AnswerRequestService from "../answer-request-service";

export default class AsnwerRequestServiceImpl implements AnswerRequestService {
    constructor (
        private readonly followRequestRepository: FollowRequestRepository,
        private readonly userRepository: UserRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    accept(requestId: UUID, credentials: Credentials): void {
        const requesterDTO = this.authenticatorService.authenticate(credentials)
        
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)
        const request = this.findRequest(requestId, credentials.userId)

        request.accept()
        requester.follow(request.receiver)

        this.userRepository.create(userToDTO(requester))
        this.followRequestRepository.create(followRequestToDTO(request))
    }

    private findRequest(requestId: UUID, requesterId: UUID): FollowRequest {
        const requestDTO = this.followRequestRepository.findById(requestId)
        if (!requestDTO)
            throw new Error(`There is not a follow request with id: ${requestId.toString()}`)

        const request = followRequestFromDTO(requestDTO)
        if (requesterId != request.receiver.value)
            throw new Error(`The user with id ${requesterId.toString()} has no permission over the request ${requestId.toString()}`)

        return request
    }

    refuse(requestId: UUID, credentials: Credentials): void {
        this.authenticatorService.authenticate(credentials)

        const request = this.findRequest(requestId, credentials.userId)
        request.refuse()

        this.followRequestRepository.create(followRequestToDTO(request))
    }
}
