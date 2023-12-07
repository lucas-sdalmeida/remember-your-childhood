import { UserAccountDTO, UserRepository } from "../../../remembering";
import { UUID } from "../../../util/types";

export default class InMemoryUserRepository implements UserRepository {
    private static db: UserAccountDTO[] = []

    async create(user: UserAccountDTO): Promise<void> {
        const index = InMemoryUserRepository.db.findIndex(u => u.id == user.id)

        if (index > -1) {
            InMemoryUserRepository.db.splice(index, 1, user)
            return
        }

        InMemoryUserRepository.db.push(user)
    }
    
    async findById(id: UUID): Promise<UserAccountDTO | undefined> {
        return InMemoryUserRepository.db.find(u => u.id == id)
    }

    async findByIdIfHasNotBlocked(id: UUID, blocked: UUID): Promise<UserAccountDTO | undefined> {
        return InMemoryUserRepository.db
            .filter(u => !u.blockList.includes(blocked))
            .find(u => u.id == id)
    }

    async findByUsername(username: string): Promise<UserAccountDTO | undefined> {
        return InMemoryUserRepository.db.find(u => u.username == username)
    }

    async findByEmail(email: string): Promise<UserAccountDTO | undefined> {
        return InMemoryUserRepository.db.find(u => u.email == email)
    }

    async findByUsernameAndEmail(username: string, email: string): Promise<UserAccountDTO | undefined> {
        return InMemoryUserRepository.db.find(u => u.username == username && u.email == email)
    }

    async findAll(): Promise<UserAccountDTO[]> {
        return InMemoryUserRepository.db
    }

    async findAllThatHasNotBlocked(blocked: UUID): Promise<UserAccountDTO[]> {
        return InMemoryUserRepository.db.filter(u => !u.blockList.includes(blocked))
    }

    async delete(id: UUID): Promise<void> {
        const index = InMemoryUserRepository.db.findIndex(u => u.id == id)
        if (index == -1) return
        InMemoryUserRepository.db.splice(index, 1)
    }

    async existsById(id: UUID): Promise<boolean> {
        return await this.findById(id) != undefined
    }

    async existsByUsername(username: string): Promise<boolean> {
        return await this.findByUsername(username) != undefined
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await this.findByEmail(email) != undefined
    }
}
