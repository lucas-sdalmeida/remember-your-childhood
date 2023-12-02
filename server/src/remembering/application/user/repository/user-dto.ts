import { UUID } from "../../../../util/types"
import { User, UserId, Username } from "../../../domain/model/user"

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

export const userFromDTO = (dto: UserDTO): User => {
    return new User(
        new UserId(dto.id),
        Username.of(dto.username),
        dto.followingList.map(f => new UserId(f)),
        dto.blockList.map(f => new UserId(f)),
    )
}

export default UserDTO
