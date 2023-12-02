import UserAccountId from "../../user/user-account-id";

export default abstract class Visibility {
    constructor (
        protected readonly owner: UserAccountId
    ) {}

    isAllowedToSee(user: UserAccountId) {
        return user == this.owner || this.allowsToSee(user)
    }

    protected abstract allowsToSee(user: UserAccountId): boolean

    abstract grantPermissionToSee(user: UserAccountId): Visibility

    abstract denyPermissionToSee(user: UserAccountId): Visibility

    abstract toString(): string
}
