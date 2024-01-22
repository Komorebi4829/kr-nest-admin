import { isPromise } from 'util/types'

import { isNil } from 'lodash'
import { EntityManager, EntityTarget } from 'typeorm'

import { Configure } from '@/modules/config/configure'
import { panic } from '@/modules/core/helpers'

import { DbFactoryHandler, FactoryOverride } from '../types'

export class DataFactory<Entity, Settings> {
    private mapFunction!: (entity: Entity) => Promise<Entity>

    constructor(
        public name: string,
        public configure: Configure,
        public entity: EntityTarget<Entity>,
        protected em: EntityManager,
        protected factory: DbFactoryHandler<Entity, Settings>,
        protected settings: Settings,
    ) {}

    map(mapFunction: (entity: Entity) => Promise<Entity>): DataFactory<Entity, Settings> {
        this.mapFunction = mapFunction
        return this
    }

    async make(overrideParams: FactoryOverride<Entity> = {}): Promise<Entity> {
        if (this.factory) {
            let entity: Entity = await this.resolveEntity(
                await this.factory(this.configure, this.settings),
            )
            if (this.mapFunction) entity = await this.mapFunction(entity)
            for (const key in overrideParams) {
                if (overrideParams[key]) {
                    entity[key] = overrideParams[key]!
                }
            }
            return entity
        }
        throw new Error('Could not found entity')
    }

    async create(
        overrideParams: FactoryOverride<Entity> = {},
        existsCheck?: string,
    ): Promise<Entity> {
        try {
            const entity = await this.make(overrideParams)
            if (!isNil(existsCheck)) {
                const repo = this.em.getRepository(this.entity)
                const value = (entity as any)[existsCheck]
                if (!isNil(value)) {
                    const item = await repo.findOneBy({ [existsCheck]: value } as any)
                    if (isNil(item)) return await this.em.save(entity)
                    return item
                }
            }
            return await this.em.save(entity)
        } catch (error) {
            const message = 'Could not save entity'
            panic({ message, error })
            throw new Error(message)
        }
    }

    async makeMany(
        amount: number,
        overrideParams: FactoryOverride<Entity> = {},
    ): Promise<Entity[]> {
        const list = []
        for (let index = 0; index < amount; index += 1) {
            list[index] = await this.make(overrideParams)
        }
        return list
    }

    async createMany(
        amount: number,
        overrideParams: FactoryOverride<Entity> = {},
        existsCheck?: string,
    ): Promise<Entity[]> {
        const list = []
        for (let index = 0; index < amount; index += 1) {
            list[index] = await this.create(overrideParams, existsCheck)
        }
        return list
    }

    private async resolveEntity(entity: Entity): Promise<Entity> {
        for (const attribute in entity) {
            if (entity[attribute]) {
                if (isPromise(entity[attribute])) {
                    entity[attribute] = await Promise.resolve(entity[attribute])
                }

                if (typeof entity[attribute] === 'object' && !(entity[attribute] instanceof Date)) {
                    const subEntityFactory = entity[attribute]
                    try {
                        if (typeof (subEntityFactory as any).make === 'function') {
                            entity[attribute] = await (subEntityFactory as any).make()
                        }
                    } catch (error) {
                        const message = `Could not make ${(subEntityFactory as any).name}`
                        panic({ message, error })
                        throw new Error(message)
                    }
                }
            }
        }
        return entity
    }
}
