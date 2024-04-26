import { isNil } from 'lodash'
import { Ora } from 'ora'
import { DataSource, EntityManager, EntityTarget, ObjectLiteral } from 'typeorm'

import { panic } from '@/bootstrap/app'
import { Configure } from '@/modules/config/configure'

import { factoryBuilder } from '../../modules/database/helpers'
import {
    DbConfig,
    DbFactory,
    DbFactoryOption,
    Seeder,
    SeederConstructor,
    SeederLoadParams,
    SeederOptions,
} from '../../modules/database/types'

export abstract class BaseSeeder implements Seeder {
    protected dataSource: DataSource

    protected em: EntityManager

    protected connection = 'default'

    protected configure: Configure

    protected ignoreLock = false

    // protected

    protected factories!: {
        [entityName: string]: DbFactoryOption<any, any>
    }

    protected truncates: EntityTarget<ObjectLiteral>[] = []

    constructor(
        protected readonly spinner: Ora,
        protected readonly args: SeederOptions,
    ) {}

    async load(params: SeederLoadParams): Promise<any> {
        const { factorier, factories, dataSource, em, connection, configure, ignoreLock } = params
        this.connection = connection
        this.dataSource = dataSource
        this.em = em
        this.factories = factories
        this.configure = configure
        this.ignoreLock = ignoreLock
        if (this.ignoreLock) {
            for (const truncate of this.truncates) {
                await this.em.clear(truncate)
            }
        }

        const result = await this.run(factorier, this.dataSource)
        return result
    }

    protected async getDbConfig() {
        const { connections = [] }: DbConfig = await this.configure.get<DbConfig>('database')
        const dbConfig = connections.find(({ name }) => name === this.connection)
        if (isNil(dbConfig)) panic(`Database connection named ${this.connection} not exists!`)
        return dbConfig
    }

    protected abstract run(
        factorier?: DbFactory,
        dataSource?: DataSource,
        em?: EntityManager,
    ): Promise<any>

    protected async call(SubSeeder: SeederConstructor) {
        const subSeeder: Seeder = new SubSeeder(this.spinner, this.args)
        await subSeeder.load({
            connection: this.connection,
            factorier: factoryBuilder(this.configure, this.dataSource, this.factories),
            factories: this.factories,
            dataSource: this.dataSource,
            em: this.em,
            configure: this.configure,
            ignoreLock: this.ignoreLock,
        })
    }
}
