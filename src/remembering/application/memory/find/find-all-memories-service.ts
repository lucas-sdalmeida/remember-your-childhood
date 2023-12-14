import { UUID } from '../../../../util/types'
import Credentials from '../../session/shared/credentials'
import ResponseModel from './response-model'

export default interface FindAllMemoriesService {
    findAll(credentials: Credentials): Promise<ResponseModel[]>
}
