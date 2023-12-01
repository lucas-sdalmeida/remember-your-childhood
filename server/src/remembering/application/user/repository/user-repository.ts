import { UUID } from "../../../../util/types";
import UserDTO from "./user-dto";

export default interface UserRepository {
    create(user: UserDTO): void

    findById(id: UUID): void

    findByUsername(username: string): void

    delete(id: UUID): void

    existsById(id: UUID): boolean

    existsByUsername(username: string): boolean
}
