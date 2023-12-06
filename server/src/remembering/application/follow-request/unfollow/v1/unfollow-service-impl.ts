import { UUID } from "../../../../../util/types";
import { UserAccount, UserAccountId } from "../../../../domain/model/user";
import { PasswordRetriver } from "../../../../domain/services";
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
        private readonly passwordRetriver: PasswordRetriver,
        private readonly authenticatorService: AuthenticatorService,
    ) {}

    unfollow(unfollowingUserId: UUID, credentials: Credentials): void {
        this.authenticatorService.authenticate(credentials)

        if (!this.userRepository.existsById(unfollowingUserId))
            throw new Error(`There is not a user with id: ${unfollowingUserId.toString()}`)
        const unfollowing = new UserAccountId(unfollowingUserId)

        const requester = this.findRequester(credentials.userId, unfollowing)
        const request = this.findLastRequest(credentials.userId, unfollowingUserId)

        requester.unfollow(unfollowing)
        request.unfollow()

        this.userRepository.create(userToDTO(requester))
        this.followRequestRepository.create(followRequestToDTO(request))
    }

    private findRequester(requesterId: UUID, unfollowingUserId: UserAccountId): UserAccount {
        const requesterDto = this.userRepository.findById(requesterId)!!
        const requester = userFromDTO(requesterDto, this.passwordRetriver.retrieve(requesterDto.password))
        
        if (!requester.isFollowing(unfollowingUserId))
            throw new Error(`The user with id ${requesterId.toString()} is not following the user with id ${unfollowingUserId.toString()}`)

        return requester
    }

    private findLastRequest(requesterId: UUID, receiverId: UUID) {
        const requestDtos = this.followRequestRepository.findSomeByRequesterIdAndReceiverId(requesterId, receiverId)
        const requests = requestDtos.map(dto => followRequestFromDTO(dto))
            .sort((first, second) => first.requestDate.valueOf() - second.requestDate.valueOf())
        return requests[requests.length - 1]
    }
}
