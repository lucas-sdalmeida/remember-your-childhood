import { UserAccountId } from '../../user'
import BlockedMemory from './blocked-memory'
import RestrictMemory from './restrict-memory'
import Visibility from './visibility'

export default class PublicMemory extends Visibility {
    protected allowsToSee(user: UserAccountId) {
        return true
    }

    grantPermissionToSee(user: UserAccountId) {
        return new RestrictMemory(this.owner, [ user ])
    }

    denyPermissionToSee(user: UserAccountId) {
        return new BlockedMemory(this.owner, [ user ])
    }

    toString() {
        return 'public memory'
    }
}
