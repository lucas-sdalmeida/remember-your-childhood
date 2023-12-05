import { UUID } from "../../../../util/types"
import { UserAccount, UserAccountId, Username } from "../../../domain/model/user"
import Email from "../../../domain/model/user/email"
import { EncryptedPassword } from "../../../domain/model/user/password"

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

export const userFromDTO = (dto: UserAccountDTO, password: EncryptedPassword) => {
    return new UserAccount(
        new UserAccountId(dto.id),
        Username.of(dto.username),
        Email.of(dto.email),
        password,
        dto.followingList.map(id => new UserAccountId(id)),
        dto.blockList.map(id => new UserAccountId(id)),
    )
}

export default UserAccountDTO
