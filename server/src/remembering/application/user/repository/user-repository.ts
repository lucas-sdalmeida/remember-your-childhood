import { UUID } from '../../../../util/types'
import UserDTO from './user-dto'

export default interface UserRepository {
    create(user: UserDTO): Promise<void>

    findById(id: UUID): Promise<UserDTO | undefined>

    findByIdIfHasNotBlocked(id: UUID, blocked: UUID): Promise<UserDTO | undefined>

    findByUsername(username: string): Promise<UserDTO | undefined>
    
    findByEmail(email: string): Promise<UserDTO | undefined>

    findByUsernameAndEmail(username: string, email: string): Promise<UserDTO | undefined>

    findAll(): Promise<UserDTO[]>

    findAllThatHasNotBlocked(blocked: UUID): Promise<UserDTO[]>

    delete(id: UUID): Promise<void>

    existsById(id: UUID): Promise<boolean>

    existsByUsername(username: string): Promise<boolean>

    existsByEmail(email: string): Promise<boolean>
}
