import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common'

import { Configure } from '../config/configure'
import { DatabaseModule } from '../database/database.module'

import { addEntities } from '../database/helpers'

import { RbacModule } from '../rbac/rbac.module'
import { UserModule } from '../user/user.module'

import * as entities from './entities'
import * as repositories from './repositories'
import * as services from './services'

@Module({})
export class DictModule {
    static async forRoot(configure: Configure): Promise<DynamicModule> {
        const providers: ModuleMetadata['providers'] = [...Object.values(services)]
        return {
            module: DictModule,
            imports: [
                UserModule,
                RbacModule,
                await addEntities(configure, Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            providers,
            exports: [
                ...Object.values(services),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
        }
    }
}
