import { UUID } from "../../../../util/types";
import MemoryDTO from "./memory-dto";

export default interface MemoryRepository {
    create(memory: MemoryDTO): Promise<void>

    findById(id: UUID): Promise<MemoryDTO | undefined>

    findSomeByOwnerId(ownerId: UUID): Promise<MemoryDTO[]>

    findAll(): Promise<MemoryDTO[]>

    delete(id: UUID): Promise<void>

    deleteByOnwerId(ownerId: UUID): Promise<void>

    existsById(id: UUID): Promise<boolean>
}
