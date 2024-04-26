import { Module } from '@nestjs/common'

import { Restful } from '@/bootstrap/restful'
import { Configure } from '@/modules/config/configure'

@Module({})
export class RestfulModule {
    static async forRoot(configure: Configure) {
        const restful = new Restful(configure)
        await restful.create(await configure.get('api'))
        const imports = restful.getModuleImports()
        return {
            module: RestfulModule,
            global: true,
            imports,
            providers: [
                {
                    provide: Restful,
                    useValue: restful,
                },
            ],
            exports: [Restful],
        }
    }
}
