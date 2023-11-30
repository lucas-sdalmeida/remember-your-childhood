import UserId from "./user-id";
import Username from "./username";

export default class User {
    constructor (
        public readonly id: UserId,
        public readonly username: Username,
    ) {}
}
