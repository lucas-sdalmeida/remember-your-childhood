import UserId from "../../user/user-id";

export default abstract class Visibility {
    constructor (
        protected readonly owner: UserId
    ) {}

    isAllowedToSee(user: UserId) {
        return user == this.owner || this.allowsToSee(user)
    }

    protected abstract allowsToSee(user: UserId): boolean

    abstract grantPermissionToSee(user: UserId): Visibility

    abstract denyPermissionToSee(user: UserId): Visibility

    abstract toString(): string
}
