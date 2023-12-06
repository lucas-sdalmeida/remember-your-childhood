import { UUID } from "../../../../util/types";
import UserDTO from "./user-dto";

export default interface UserRepository {
    create(user: UserDTO): void

    findById(id: UUID): UserDTO | undefined

    findByIdIfHasNotBlocked(id: UUID, blocked: UUID): UserDTO | undefined

    findByUsername(username: string): UserDTO | undefined
    
    findByEmail(email: string): UserDTO | undefined

    findByUsernameAndEmail(username: string, email: string): UserDTO | undefined

    findAll(): UserDTO[]

    findAllThatHasNotBlocked(blocked: UUID): UserDTO[]

    delete(id: UUID): void

    existsById(id: UUID): boolean

    existsByUsername(username: string): boolean

    existsByEmail(email: string): boolean
}
