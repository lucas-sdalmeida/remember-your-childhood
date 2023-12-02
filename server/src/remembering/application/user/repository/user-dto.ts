import { UUID } from "../../../../util/types"
import { UserAccount } from "../../../domain/model/user"

type UserAccountDTO = {
    id: UUID,
    username: string,
    email: string,
    password: string,
    followingList: UUID[],
    blockList: UUID[],
}

export const userToDTO = (user: UserAccount): UserAccountDTO => {
    return {
        id: user.id.value,
        username: user.username.toString(),
        email: user.email.toString(),
        password: user.password.toString(),
        followingList: user.followingList.map(u => u.value),
        blockList: user.blockList.map(u => u.value),
    }
}

export default UserAccountDTO
