import { expect, test } from '@jest/globals'
import Identifier from './identifier'
import Entity from './entity'

class EntityAId extends Identifier {
    constructor (readonly value: number) { super() }

    equals(other: unknown): boolean {
        if (!other || !(other instanceof EntityAId)) return false
        return this.value == other.value
    }
}

class EntityA extends Entity<EntityAId> {
}

test('Should two entities with same class and id be equals', () => {
    const entity1 = new EntityA(new EntityAId(10))
    const entity2 = new EntityA(new EntityAId(10))

    expect(entity1.equals(entity2)).toBeTruthy()
})
