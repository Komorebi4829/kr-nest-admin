import { DynamicModule, Module, forwardRef } from '@nestjs/common'

import { getDataSourceToken } from '@nestjs/typeorm'

import { DataSource } from 'typeorm'

import { Configure } from '../config/configure'
import { DatabaseModule } from '../database/database.module'
import { addEntities, addSubscribers } from '../database/helpers'
import { UserModule } from '../user/user.module'

import * as entities from './entities'
import { RbacGuard } from './guards'
import { RbacBootstrap } from './rbac.bootstrap'
import * as repositories from './repositories'
import * as services from './services'
import * as subscribers from './subscribers'

@Module({})
export class RbacModule {
    static async forRoot(configure: Configure): Promise<DynamicModule> {
        return {
            module: RbacModule,
            imports: [
                forwardRef(() => UserModule),
                addEntities(configure, Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            providers: [
                ...Object.values(services),
                ...(await addSubscribers(configure, Object.values(subscribers))),
                RbacGuard,
                {
                    provide: RbacBootstrap,
                    useFactory: async (dataSource: DataSource) => {
                        const resolver = new RbacBootstrap(dataSource, configure)
                        resolver.setOptions({})
                        return resolver
                    },
                    inject: [getDataSourceToken()],
                },
            ],
            exports: [
                RbacBootstrap,
                ...Object.values(services),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
        }
    }
}
