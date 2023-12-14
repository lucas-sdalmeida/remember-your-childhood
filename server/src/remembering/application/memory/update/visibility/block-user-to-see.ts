import { UUID } from '../../../../../util/types'
import Credentials from '../../../session/shared/credentials'
import ResponseModel from '../response-model'

export default interface BlockUserToSeeService {
    blockUser(memoryId: UUID, userId: UUID, credentials: Credentials): Promise<ResponseModel>
}
