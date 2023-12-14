import { UUID } from '../../../../../util/types'
import Credentials from '../../../session/shared/credentials'
import ResponseModel from '../response-model'

export default interface AddMomentService {
    add(id: UUID, model: RequestModel, credentials: Credentials): Promise<ResponseModel>
}

export type RequestModel = {
    description: string
}
