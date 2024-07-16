import { resolve } from 'path'

import { NestFactory } from '@nestjs/core'

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { existsSync } from 'fs-extra'

import { isNil, join } from 'lodash'

import { LoggerInterceptor } from './bootstrap/logger.interceptor'
import { Restful } from './bootstrap/restful'
import { RestfulModule } from './bootstrap/restful.module'
import { CreateOptions } from './bootstrap/types'
import * as configs from './config'
// import { ArticleModule } from './modules/article/article.module'
import { ApiConfig } from './helpers/types'
import { ContentModule } from './modules/content/content.module'
import * as dbCommands from './modules/database/commands'
import { DatabaseModule } from './modules/database/database.module'
import { DictModule } from './modules/dict/dict.module'
import { MeilliModule } from './modules/meilisearch/melli.module'
import { RbacGuard } from './modules/rbac/guards'
import { RbacModule } from './modules/rbac/rbac.module'

import { UserModule } from './modules/user/user.module'

export const createOptions: CreateOptions = {
    config: {
        factories: configs,
        storage: {
            filePath: resolve(__dirname, '../', 'config.yml'),
        },
    },
    modules: async (configure) => [
        DatabaseModule.forRoot(configure),
        MeilliModule.forRoot(configure),
        RestfulModule.forRoot(configure),
        ContentModule.forRoot(configure),
        DictModule.forRoot(configure),
        UserModule.forRoot(configure),
        RbacModule.forRoot(configure),
    ],
    commands: () => [...Object.values(dbCommands)],
    globals: {
        guard: RbacGuard,
        interceptor: LoggerInterceptor,
    },
    builder: async ({ configure, BootModule }) => {
        const container = await NestFactory.create<NestFastifyApplication>(
            BootModule,
            new FastifyAdapter(),
            {
                cors: true,
                logger: ['error', 'warn'],
            },
        )
        if (!isNil(await configure.get<ApiConfig>('api', null))) {
            const restful = container.get(Restful)
            /**
             * 判断是否存在metadata模块,存在的话则加载并传入factoryDocs
             */
            let metadata: () => Promise<Record<string, any>>
            if (existsSync(join(__dirname, 'metadata.js'))) {
                metadata = (await import(join(__dirname, 'metadata.js'))).default
            }
            if (existsSync(join(__dirname, 'metadata.ts'))) {
                metadata = (await import(join(__dirname, 'metadata.ts'))).default
            }
            await restful.setupSwagger(container, metadata)
        }
        return container
    },
}
