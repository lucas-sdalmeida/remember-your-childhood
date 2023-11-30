import { Entity } from "../../util";
import UserId from "./user-id";
import Username from "./username";

export default class User extends Entity<UserId> {
    constructor (
        id: UserId,
        public readonly username: Username,
    ) {
        super(id)
    }
}
