import { UUID } from '../../../../util/types'
import Credentials from '../../session/shared/credentials'

export default interface AnswerRequestService {
    accept(requestId: UUID, credentials: Credentials): Promise<void>

    refuse(requestId: UUID, credentials: Credentials): Promise<void>
}
