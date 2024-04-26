import { resolve } from 'path'

import { deepMerge } from '@/utils/common'

import { createConnectionOptions } from '../config/helpers'
import { ConfigureFactory, ConfigureRegister } from '../config/types'

import { SeedRunner } from './resolver/seed.runner'
import { DbConfig, DbOptions, TypeormOption } from './types'

export const createDbConfig: (
    register: ConfigureRegister<RePartial<DbConfig>>,
) => ConfigureFactory<DbConfig, DbOptions> = (register) => ({
    register,
    hook: (configure, value) => createDbOptions(value),
    defaultRegister: () => ({
        common: {
            charset: 'utf8mb4',
            logging: ['error'],
            seedRunner: SeedRunner,
            seeders: [],
            factories: [],
        },
        connections: [],
    }),
})

export const createDbOptions = (options: DbConfig) => {
    const newOptions: DbOptions = {
        common: deepMerge(
            {
                charset: 'utf8mb4',
                logging: ['error'],
                autoMigrate: true,
                paths: {
                    migration: resolve(__dirname, '../../database/migrations'),
                },
            },
            options.common ?? {},
            'replace',
        ),
        connections: createConnectionOptions(options.connections ?? []),
    }
    newOptions.connections = newOptions.connections.map((connection) => {
        const entities = connection.entities ?? []
        const newOption = { ...connection, entities }
        return deepMerge(
            newOptions.common,
            {
                ...newOption,
                autoLoadEntities: true,
                synchronize: false,
            } as any,
            'replace',
        ) as TypeormOption
    })
    return newOptions
}
