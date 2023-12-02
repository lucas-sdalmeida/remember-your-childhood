import { UserId } from "../../../../remembering";
import { Entity } from "../../util";
import AccountId from "./account-id";
import Email from "./email";
import { EncryptedPassword } from "./password";

export default class Account extends Entity<AccountId> {
    constructor(
        id: AccountId,
        public readonly userId: UserId,
        public readonly email: Email,
        public readonly password: EncryptedPassword,
    ) { super(id) }
}
