import { FollowRequestDTO, FollowRequestRepository } from "../../../remembering";
import { UUID } from "../../../util/types";

export default class InMemoryFollowRequestRepository implements FollowRequestRepository {
    private static db: FollowRequestDTO[] = []

    async create(request: FollowRequestDTO): Promise<void> {
        const index = InMemoryFollowRequestRepository.db.findIndex(r => r.id == request.id)

        if (index > -1) {
            InMemoryFollowRequestRepository.db.splice(index, 1, request)
            return
        }

        InMemoryFollowRequestRepository.db.push(request)
    }
    
    async findById(id: number): Promise<FollowRequestDTO | undefined> {
        return InMemoryFollowRequestRepository.db.find(r => r.id == id)
    }

    async findSomeByRequesterId(requesterId: UUID): Promise<FollowRequestDTO[]> {
        return InMemoryFollowRequestRepository.db.filter(r => r.requesterId == requesterId)
    }

    async findSomeByRequesterIdAndReceiverId(requesterId: UUID, receiverId: UUID): Promise<FollowRequestDTO[]> {
        return InMemoryFollowRequestRepository.db.filter(r => r.requesterId == requesterId && r.receiverId == receiverId)
    }

    async findAll(): Promise<FollowRequestDTO[]> {
        return InMemoryFollowRequestRepository.db
    }

    async delete(id: number): Promise<void> {
        const index = InMemoryFollowRequestRepository.db.findIndex(r => r.id == id)
        if (index == -1) return
        InMemoryFollowRequestRepository.db.splice(index, 1)
    }

    async existsById(id: number): Promise<boolean> {
        return await this.findById(id) != undefined
    }
}
