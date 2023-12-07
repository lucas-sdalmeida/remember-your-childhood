import { MemoryDTO, MemoryRepository } from "../../../remembering/";
import { UUID } from "../../../util/types";

export default class InMemoryMemoryRepository implements MemoryRepository {
    private static db: MemoryDTO[] = []

    async create(memory: MemoryDTO): Promise<void> {
        const existentMemory = InMemoryMemoryRepository.db.findIndex(m => m.id == memory.id)
        
        if (existentMemory > -1) {
            InMemoryMemoryRepository.db.splice(existentMemory, 1, memory)
            return
        }

        InMemoryMemoryRepository.db.push(memory)
    }

    async findById(id: UUID): Promise<MemoryDTO | undefined> {
        return InMemoryMemoryRepository.db.find(m => m.id == id)
    }

    async findSomeByOwnerId(ownerId: UUID): Promise<MemoryDTO[]> {
        return InMemoryMemoryRepository.db.filter(m => m.ownerId == ownerId)
    }

    async findAll(): Promise<MemoryDTO[]> {
        return InMemoryMemoryRepository.db
    }

    async delete(id: UUID): Promise<void> {
        const index = InMemoryMemoryRepository.db.findIndex(m => m.id == id)
        if (index == -1) return
        InMemoryMemoryRepository.db.splice(index, 1)
    }

    async deleteByOnwerId(ownerId: UUID): Promise<void> {
        let index = InMemoryMemoryRepository.db.findIndex(m => m.ownerId == ownerId)
        while (index > -1) {
            InMemoryMemoryRepository.db.splice(index, 1)
            index = InMemoryMemoryRepository.db.findIndex(m => m.ownerId == ownerId)
        }
    }

    async existsById(id: UUID): Promise<boolean> {
        return InMemoryMemoryRepository.db.find(m => m.id == id) != undefined
    }
}
