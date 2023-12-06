import { UUID } from "../../../../util/types";
import MemoryDTO from "./memory-dto";

export default interface MemoryRepository {
    create(memory: MemoryDTO): void

    findById(id: UUID): MemoryDTO | undefined

    findSomeByOwnerId(ownerId: UUID): MemoryDTO[]

    findAll(): MemoryDTO[]

    delete(id: UUID): void

    deleteByOnwerId(ownerId: UUID): void

    existsById(id: UUID): boolean
}
