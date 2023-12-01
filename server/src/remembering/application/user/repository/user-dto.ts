import { UUID } from "../../../../util/types"
import { User } from "../../../domain/model/user"

type UserDTO = {
    id: UUID,
    username: string,
    followingList: UUID[],
    blockList: UUID[],
}

export const userToDTO = (user: User): UserDTO => {
    return {
        id: user.id.value,
        username: user.username.toString(),
        followingList: user.followingList.map(u => u.value),
        blockList: user.blockList.map(u => u.value),
    }
}

export default UserDTO
