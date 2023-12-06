import { UUID } from "../../../../../util/types";
import { UserAccount, UserAccountId } from "../../../../domain/model/user";
import { PasswordRetriever } from "../../../../domain/services";
import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { UserRepository } from "../../../user/repository";
import { userFromDTO, userToDTO } from "../../../user/repository/user-dto";
import { FollowRequestRepository } from "../../repository";
import { followRequestFromDTO, followRequestToDTO } from "../../repository/follow-request-dto";
import UnfollowService from "../unfollow-service";

export default class UnfollowServiceImpl implements UnfollowService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly followRequestRepository: FollowRequestRepository,
        private readonly passwordRetriever: PasswordRetriever,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    unfollow(unfollowingUserId: UUID, credentials: Credentials): void {
        const requesterDTO = this.authenticatorService.authenticate(credentials)
        const requester = userFromDTO(requesterDTO, this.passwordRetriever)

        if (!this.userRepository.existsById(unfollowingUserId))
            throw new Error(`There is not a user with id: ${unfollowingUserId.toString()}`)
        
        const unfollowing = new UserAccountId(unfollowingUserId)
        
        if (!requester.isFollowing(unfollowing))
            throw new Error(`The user with id ${requester.id.toString()} is not following the user with id ${unfollowing.toString()}`)
        
        const request = this.findLastRequest(credentials.userId, unfollowingUserId)
        requester.unfollow(unfollowing)
        request.unfollow()

        this.userRepository.create(userToDTO(requester))
        this.followRequestRepository.create(followRequestToDTO(request))
    }

    private findLastRequest(requesterId: UUID, receiverId: UUID) {
        const requestDtos = this.followRequestRepository.findSomeByRequesterIdAndReceiverId(requesterId, receiverId)
        const requests = requestDtos.map(dto => followRequestFromDTO(dto))
            .sort((first, second) => first.requestDate.valueOf() - second.requestDate.valueOf())
        return requests[requests.length - 1]
    }
}
