import { AuthenticatorService } from '../../../session/auth'
import Credentials from '../../../session/shared/credentials'
import { UserRepository } from '../../repository'
import FindAllUsersService from '../find-all-users-service'
import ResponseModel from '../response-model'

export default class FindAllUsersServiceImpl implements FindAllUsersService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly authenticator: AuthenticatorService,
    ) {}

    async findAll(credentials: Credentials): Promise<ResponseModel[]> {
        await this.authenticator.authenticate(credentials)
        return (await this.userRepository.findAllThatHasNotBlocked(credentials.userId))
            .map(dto => { return { 
                user: { 
                    id: dto.id,
                    username: dto.username,
                    email: dto.email,
                    followingList: dto.followingList,
                    blockList: dto.blockList
                } 
            }})
    }
}
