import { UUID } from "../../../../util/types";
import AccountDto from "./account-dto";

export default interface AccountRepository {
    create(account: AccountDto): void

    findById(id: UUID): AccountDto | undefined

    findAll(): AccountDto[]

    delete(id: UUID): void

    existsById(id: UUID): boolean

    existsByEmail(email: string): boolean

    existsByIdAndUserId(id: UUID, userId: UUID): boolean
}
