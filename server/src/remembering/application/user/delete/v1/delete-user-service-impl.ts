import { UUID } from "../../../../../util/types";
import { DeleteMemoryService } from "../../../memory/delete";
import { AuthenticatorService } from "../../../session/auth";
import Credentials from "../../../session/shared/credentials";
import { UserRepository } from "../../repository";
import DeleteUserService from "../delete-user-service";

export default class DeleteUserServiceImpl implements DeleteUserService {
    constructor (
        private readonly userRepository: UserRepository,
        private readonly authenticatorService: AuthenticatorService,
        private readonly deleteMemoryService: DeleteMemoryService,
    ) {}

    delete(id: UUID, credentials: Credentials): void {
        const requesterDTO = this.authenticatorService.authenticate(credentials)

        if (requesterDTO.id != id) throw new Error(
            `The user with id ${requesterDTO.id.toString()} does not have permission to delete account of user ${id.toString()}`
        )
        
        this.deleteMemoryService.deleteByOwnerId(id, credentials)
        this.userRepository.delete(id)
    }
}
