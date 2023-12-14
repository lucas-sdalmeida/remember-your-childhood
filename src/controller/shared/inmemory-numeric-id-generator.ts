import InMemoryFollowRequestRepository from '../../persistence/inmemory/follor-request/inmemory-follow-request-repository'
import { NumericIdGenerator } from '../../remembering'
import { UUID } from '../../util/types'

export default class InMemoryNumericIdGenerator implements NumericIdGenerator {
    constructor (
        private readonly requesterId: UUID,
    ) {}

    async next(): Promise<number> {
        const repository = new InMemoryFollowRequestRepository()
        const requests = (await repository.findSomeByRequesterId(this.requesterId))
        
        if (requests.length == 0) return 1
        
        const lastRequest = requests.sort((first, second) => first.id - second.id)[requests.length - 1]
        return lastRequest.id + 1
    }
}
