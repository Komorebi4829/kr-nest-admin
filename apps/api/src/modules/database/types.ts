import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Ora } from 'ora'
import {
    DataSource,
    EntityManager,
    EntityTarget,
    FindTreeOptions,
    ObjectLiteral,
    ObjectType,
    Repository,
    SelectQueryBuilder,
    TreeRepository,
} from 'typeorm'

import { Arguments } from 'yargs'

import { BaseRepository, BaseTreeRepository } from '@/helpers/BaseClass'

import { Configure } from '../config/configure'

import { OrderType, SelectTrashMode } from './constants'
import { DataFactory } from './resolver/data.factory'

export type DbConfig = {
    common: Record<string, any> & DbAdditionalOption
    connections: Array<TypeOrmModuleOptions & { name?: string } & DbAdditionalOption>
}

export type DbOptions = Record<string, any> & {
    common: Record<string, any>
    connections: TypeormOption[]
}

export type TypeormOption = Omit<TypeOrmModuleOptions, 'name' | 'migrations'> & {
    name: string
} & DbAdditionalOption

export type QueryHook<Entity> = (
    qb: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>

export interface PaginateMeta {
    itemCount: number

    totalItems?: number

    perPage: number

    totalPages?: number

    currentPage: number
}

export interface PaginateOptions {
    page?: number

    limit?: number
}

export interface PaginateReturn<E extends ObjectLiteral> {
    meta: PaginateMeta
    items: E[]
}

export type OrderQueryType =
    | string
    | { name: string; order: `${OrderType}` }
    | Array<{ name: string; order: `${OrderType}` } | string>

export interface QueryParams<E extends ObjectLiteral> {
    addQuery?: QueryHook<E>
    orderBy?: OrderQueryType
    withTrashed?: boolean
    onlyTrashed?: boolean
}

export type ServiceListQueryOption<E extends ObjectLiteral> =
    | ServiceListQueryOptionWithTrashed<E>
    | ServiceListQueryOptionNotWithTrashed<E>

type ServiceListQueryOptionWithTrashed<E extends ObjectLiteral> = Omit<
    FindTreeOptions & QueryParams<E>,
    'withTrashed'
> & {
    trashed?: `${SelectTrashMode}`
} & Record<string, any>

type ServiceListQueryOptionNotWithTrashed<E extends ObjectLiteral> = Omit<
    ServiceListQueryOptionWithTrashed<E>,
    'trashed'
>

export interface TrashedDto {
    trashed?: SelectTrashMode
}

// src/modules/database/types.ts

export type RepositoryType<E extends ObjectLiteral> =
    | Repository<E>
    | TreeRepository<E>
    | BaseRepository<E>
    | BaseTreeRepository<E>

export type TypeOrmArguments = Arguments<{
    connection?: string
}>

export type MigrationCreateArguments = TypeOrmArguments & MigrationCreateOptions

export type MigrationRunArguments = TypeOrmArguments & MigrationRunOptions

export type MigrationGenerateArguments = TypeOrmArguments & MigrationGenerateOptions

export type MigrationRevertArguments = TypeOrmArguments & MigrationRevertOptions

export interface MigrationCreateOptions {
    name: string
    // outputJs?: boolean;
}

export interface MigrationGenerateOptions {
    name?: string
    run?: boolean
    pretty?: boolean
    // outputJs?: boolean;
    dryrun?: boolean
    check?: boolean
}

export interface MigrationRunOptions extends MigrationRevertOptions {
    refresh?: boolean
    onlydrop?: boolean
    clear?: boolean
    seed?: boolean
}

export interface MigrationRevertOptions {
    transaction?: string
    fake?: boolean
}

type DbAdditionalOption = {
    autoMigrate?: boolean

    seedRunner?: SeederConstructor

    seeders?: SeederConstructor[]

    factories?: (() => DbFactoryOption<any, any>)[]

    paths?: {
        migration?: string
    }
}

export type SeederArguments = TypeOrmArguments & SeederOptions

export interface SeederOptions {
    connection?: string
    transaction?: boolean
    ignorelock?: boolean
}

export interface SeederConstructor {
    new (spinner: Ora, args: SeederOptions): Seeder
}

export interface Seeder {
    lazyInit: (params: SeederLoadParams) => Promise<void>
}

export interface SeederLoadParams {
    connection: string

    dataSource: DataSource

    em: EntityManager

    factorier?: DbFactory

    factories: FactoryOptions

    configure: Configure

    ignoreLock: boolean
}

export interface DbFactory {
    <Entity>(
        entity: EntityTarget<Entity>,
    ): <Options>(options?: Options) => DataFactory<Entity, Options>
}

export type DbFactoryOption<E, O> = {
    entity: ObjectType<E>
    handler: DbFactoryHandler<E, O>
}

export type FactoryOptions = {
    [entityName: string]: DbFactoryOption<any, any>
}

export type DbFactoryHandler<E, O> = (configure: Configure, options: O) => Promise<E>

export type FactoryOverride<Entity> = {
    [Property in keyof Entity]?: Entity[Property]
}

export type DbFactoryBuilder = (
    configure: Configure,
    dataSource: DataSource,
    factories: {
        [entityName: string]: DbFactoryOption<any, any>
    },
) => DbFactory

export type DefineFactory = <E, O>(
    entity: ObjectType<E>,
    handler: DbFactoryHandler<E, O>,
) => () => DbFactoryOption<E, O>

export type SubcriberSetting = {
    // 监听的模型是否为树模型
    tree?: boolean
    // 是否支持软删除
    trash?: boolean
}
