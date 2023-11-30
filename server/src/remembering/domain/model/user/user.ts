import UserId from "./user-id";
import Username from "./username";

export default class User {
    constructor (
        private readonly id: UserId,
        private readonly username: Username,
    ) {}
}
