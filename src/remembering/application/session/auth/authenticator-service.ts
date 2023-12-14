import { UserAccountDTO } from '../../user/repository'
import Credentials from '../shared/credentials'

export default interface AuthenticatorService {
    authenticate(credentials: Credentials): Promise<UserAccountDTO>
}
