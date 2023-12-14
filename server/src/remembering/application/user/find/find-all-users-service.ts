import Credentials from '../../session/shared/credentials'
import ResponseModel from './response-model'

export default interface FindAllUsersService {
    findAll(credentials: Credentials): Promise<ResponseModel[]>
}
