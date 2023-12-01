import { Identifier } from "../../../../remembering/domain/util";
import { Entity } from "../../util";
import AccountId from "./account-id";
import Email from "./email";
import { Password } from "./password";

export default class Account extends Entity<Identifier> {
    constructor (
        id: AccountId,
        public readonly email: Email,
        public readonly password: Password,
    ) { super(id) }
}