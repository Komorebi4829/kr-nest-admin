import * as fakerjs from '@faker-js/faker'
import { Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { isNil } from 'lodash'
import { Ora } from 'ora'
import {
    DataSource,
    DataSourceOptions,
    EntityManager,
    EntityTarget,
    ObjectLiteral,
    ObjectType,
    Repository,
    SelectQueryBuilder,
} from 'typeorm'

import { AppConfig } from '@/bootstrap/types'

import { Configure } from '../config/configure'

import { CUSTOM_REPOSITORY_METADATA } from './constants'
import { DataFactory } from './resolver/data.factory'
import {
    DbConfig,
    DbFactoryBuilder,
    DbOptions,
    DefineFactory,
    FactoryOptions,
    OrderQueryType,
    PaginateOptions,
    PaginateReturn,
    Seeder,
    SeederConstructor,
    SeederOptions,
    TypeormOption,
} from './types'

export const paginate = async <E extends ObjectLiteral>(
    qb: SelectQueryBuilder<E>,
    options: PaginateOptions,
): Promise<PaginateReturn<E>> => {
    const limit = isNil(options.limit) || options.limit < 1 ? 1 : options.limit
    const page = isNil(options.page) || options.page < 1 ? 1 : options.page
    const start = page >= 1 ? page - 1 : 0
    const totalItems = await qb.getCount()
    qb.take(limit).skip(start * limit)
    const items = await qb.getMany()
    const totalPages =
        totalItems % limit === 0
            ? Math.floor(totalItems / limit)
            : Math.floor(totalItems / limit) + 1
    const remainder = totalItems % limit !== 0 ? totalItems % limit : limit
    const itemCount = page < totalPages ? limit : remainder
    return {
        items,
        meta: {
            totalItems,
            itemCount,
            perPage: limit,
            totalPages,
            currentPage: page,
        },
    }
}

export function treePaginate<E extends ObjectLiteral>(
    options: PaginateOptions,
    data: E[],
): PaginateReturn<E> {
    const { page, limit } = options
    let items: E[] = []
    const totalItems = data.length
    const totalRst = totalItems / limit
    const totalPages =
        totalRst > Math.floor(totalRst) ? Math.floor(totalRst) + 1 : Math.floor(totalRst)
    let itemCount = 0
    if (page <= totalPages) {
        itemCount = page === totalPages ? totalItems - (totalPages - 1) * limit : limit
        const start = (page - 1) * limit
        items = data.slice(start, start + itemCount)
    }
    return {
        meta: {
            itemCount,
            totalItems,
            perPage: limit,
            totalPages,
            currentPage: page,
        },
        items,
    }
}

export const getOrderByQuery = <E extends ObjectLiteral>(
    qb: SelectQueryBuilder<E>,
    alias: string,
    orderBy?: OrderQueryType,
) => {
    if (isNil(orderBy)) return qb
    if (typeof orderBy === 'string') return qb.orderBy(`${alias}.${orderBy}`, 'DESC')
    if (Array.isArray(orderBy)) {
        for (const item of orderBy) {
            typeof item === 'string'
                ? qb.addOrderBy(`${alias}.${item}`, 'DESC')
                : qb.addOrderBy(`${alias}.${item.name}`, item.order)
        }
        return qb
    }
    return qb.orderBy(`${alias}.${(orderBy as any).name}`, (orderBy as any).order)
}

export const getCustomRepository = <T extends Repository<E>, E extends ObjectLiteral>(
    dataSource: DataSource,
    Repo: ClassType<T>,
): T => {
    if (isNil(Repo)) return null
    const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo)
    if (!entity) return null
    const base = dataSource.getRepository<ObjectType<any>>(entity)
    return new Repo(base.target, base.manager, base.queryRunner) as T
}

export const addEntities = async (
    configure: Configure,
    entities: EntityClassOrSchema[] = [],
    dataSource = 'default',
) => {
    const database = await configure.get<DbOptions>('database')
    if (isNil(database)) throw new Error(`Typeorm have not any config!`)
    const dbConfig = database.connections.find(({ name }) => name === dataSource)
    // eslint-disable-next-line prettier/prettier, prefer-template
    if (isNil(dbConfig)) throw new Error('Database connection named' + dataSource + 'not exists!')
    const oldEntities = (dbConfig.entities ?? []) as ObjectLiteral[]

    configure.set(
        'database.connections',
        database.connections.map((connection) =>
            connection.name === dataSource
                ? {
                      ...connection,
                      entities: [...entities, ...oldEntities],
                  }
                : connection,
        ),
    )
    return TypeOrmModule.forFeature(entities, dataSource)
}

export const addSubscribers = async (
    configure: Configure,
    subscribers: Type<any>[] = [],
    dataSource = 'default',
) => {
    const database = await configure.get<DbConfig>('database')
    if (isNil(database)) throw new Error(`Typeorm have not any config!`)
    const dbConfig = database.connections.find(({ name }) => name === dataSource)
    // eslint-disable-next-line prettier/prettier, prefer-template
    if (isNil(dbConfig)) throw new Error('Database connection named' + dataSource + 'not exists!')

    const oldSubscribers = (dbConfig.subscribers ?? []) as any[]

    configure.set(
        'database.connections',
        database.connections.map((connection) =>
            connection.name === dataSource
                ? {
                      ...connection,
                      subscribers: [...oldSubscribers, ...subscribers],
                  }
                : connection,
        ),
    )
    return subscribers
}

export function entityName<T>(entity: EntityTarget<T>): string {
    if (entity instanceof Function) return entity.name
    if (!isNil(entity)) return new (entity as any)().constructor.name
    throw new Error('Enity is not defined')
}

export const defineFactory: DefineFactory = (entity, handler) => () => ({
    entity,
    handler,
})

export const factoryBuilder: DbFactoryBuilder =
    (configure, dataSource, factories) => (entity) => (settings) => {
        const name = entityName(entity)
        if (!factories[name]) {
            throw new Error(`has none factory for entity named ${name}`)
        }
        return new DataFactory(
            name,
            configure,
            entity,
            dataSource.createEntityManager(),
            factories[name].handler,
            settings,
        )
    }

export async function resetForeignKey(
    em: EntityManager,
    type = 'mysql',
    disabled = true,
): Promise<EntityManager> {
    let key: string
    let query: string
    if (type === 'sqlite') {
        key = disabled ? 'OFF' : 'ON'
        query = `PRAGMA foreign_keys = ${key};`
    } else if (type === 'mysql') {
        key = disabled ? '0' : '1'
        query = `SET FOREIGN_KEY_CHECKS = ${key};`
    } else if (type === 'postgres') {
        // PostgreSQL 始终启用外键约束，无需设置
        return em
    }
    await em.query(query)
    return em
}

export async function runSeeder(
    Clazz: SeederConstructor,
    args: SeederOptions,
    spinner: Ora,
    configure: Configure,
    dbConfig: TypeormOption,
): Promise<DataSource> {
    const seeder: Seeder = new Clazz(spinner, args)
    const dataSource = new DataSource({ ...dbConfig } as DataSourceOptions)

    await dataSource.initialize()
    const factoryMaps: FactoryOptions = {}
    for (const factory of dbConfig.factories) {
        const { entity, handler } = factory()
        factoryMaps[entity.name] = { entity, handler }
    }
    if (typeof args.transaction === 'boolean' && !args.transaction) {
        const em = await resetForeignKey(dataSource.manager, dataSource.options.type)
        await seeder.lazyInit({
            factorier: factoryBuilder(configure, dataSource, factoryMaps),
            factories: factoryMaps,
            dataSource,
            em,
            configure,
            connection: args.connection ?? 'default',
            ignoreLock: args.ignorelock,
        })
        await resetForeignKey(em, dataSource.options.type, false)
    } else {
        const queryRunner = dataSource.createQueryRunner()
        await queryRunner.connect()
        try {
            const em = await resetForeignKey(queryRunner.manager, dataSource.options.type)
            await seeder.lazyInit({
                factorier: factoryBuilder(configure, dataSource, factoryMaps),
                factories: factoryMaps,
                dataSource,
                em,
                queryRunner,
                configure,
                connection: args.connection ?? 'default',
                ignoreLock: args.ignorelock,
            })
            await resetForeignKey(em, dataSource.options.type, false)
        } catch (err) {
            console.log('~ file: helpers.ts:324 ~ err:', err)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
    if (dataSource.isInitialized) await dataSource.destroy()
    return dataSource
}

export const getFakerLocales = async (configure: Configure) => {
    const app = await configure.get<AppConfig>('app')
    const locales: fakerjs.LocaleDefinition[] = []
    const locale = app.locale as keyof typeof fakerjs
    const fallbackLocale = app.fallbackLocale as keyof typeof fakerjs
    if (!isNil(fakerjs[locale])) locales.push(fakerjs[locale] as fakerjs.LocaleDefinition)
    if (!isNil(fakerjs[fallbackLocale]))
        locales.push(fakerjs[fallbackLocale] as fakerjs.LocaleDefinition)
    return locales
}
