import { UUID } from "../../../../../util/types";
import { UserAccount } from "../../../../domain/model/user";
import { PasswordRetriver } from "../../../../domain/services";
import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { UserRepository } from "../../../user/repository";
import { userFromDTO, userToDTO } from "../../../user/repository/user-dto";
import { FollowRequestRepository } from "../../repository";
import { followRequestFromDTO, followRequestToDTO } from "../../repository/follow-request-dto";
import AcceptRequestService from "../accept-request-service";

export default class AcceptRequestServiceImpl implements AcceptRequestService {
    constructor (
        private readonly followRequestRepository: FollowRequestRepository,
        private readonly userRepository: UserRepository,
        private readonly passwordRetriver: PasswordRetriver,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    accept(requestId: string, credentials: Credentials): void {
        this.authenticatorService.authenticate(credentials)

        const requestDTO = this.followRequestRepository.findById(requestId)
        if (!requestDTO)
            throw new Error(`There is not a follow request with id: ${requestId}`)

        const request = followRequestFromDTO(requestDTO)
        if (credentials.userId != request.receiver.value)
            throw new Error(`The user with id ${credentials.userId} has no permission over the request ${requestId}`)

        const requester = this.findRequester(request.requester.value)

        request.accept()
        requester.follow(request.receiver)

        this.userRepository.create(userToDTO(requester))
        this.followRequestRepository.create(followRequestToDTO(request))
    }

    private findRequester(requesterId: UUID) {
        const dto = this.userRepository.findById(requesterId)!!
        return userFromDTO(dto,  this.passwordRetriver.retrieve(dto.password))
    }
}
