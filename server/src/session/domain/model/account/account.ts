import { Identifier } from "../../../../remembering/domain/util";
import { Entity } from "../../util";
import AccountId from "./account-id";
import Email from "./email";

export default class Account extends Entity<Identifier> {
    constructor (
        id: AccountId,
        public readonly email: Email,
        public readonly password: string,
    ) { super(id) }
}