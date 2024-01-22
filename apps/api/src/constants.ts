import { NestFactory } from '@nestjs/core'

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import * as configs from './config'
import { CreateOptions } from './modules/core/types'

export const createOptions: CreateOptions = {
    config: { factories: configs, storage: { enabled: true } },
    modules: async (configure) => [],
    commands: () => [
        // ...Object.values(dbCommands)
    ],
    globals: {
        // guard: RbacGuard,
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
        // if (!isNil(await configure.get<ApiConfig>('api', null))) {
        //     const restful = container.get(Restful)
        //     /**
        //      * 判断是否存在metadata模块,存在的话则加载并传入factoryDocs
        //      */
        //     let metadata: () => Promise<Record<string, any>>
        //     if (existsSync(join(__dirname, 'metadata.js'))) {
        //         metadata = (await import(join(__dirname, 'metadata.js'))).default
        //     }
        //     if (existsSync(join(__dirname, 'metadata.ts'))) {
        //         metadata = (await import(join(__dirname, 'metadata.ts'))).default
        //     }
        //     await restful.factoryDocs(container, metadata)
        // }
        return container
    },
}
