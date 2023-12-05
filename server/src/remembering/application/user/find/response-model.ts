import { UUID } from "../../../../util/types"
import { UserAccountDTO } from "../repository"

type ResponseModel = {
    user: {
        id: UUID,
        username: string,
        email: string,
        followingList: UUID[],
        blockList: UUID[],
    },
}

export default ResponseModel
