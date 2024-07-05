// import { ContentFactory } from '@/database/factories/content.factory'
// import { UserFactory } from '@/database/factories/user.factory'
// import ContentSeeder from '@/database/seeders/content.seeder'
import MenuSeeder from '@/database/seeders/menu.seeder'
// import UserSeeder from '@/database/seeders/user.seeder'
import { Configure } from '@/modules/config/configure'
import { createDbConfig } from '@/modules/database/config'

export const database = createDbConfig((configure: Configure) => {
    return {
        common: {
            // synchronize: true,
        },
        connections: [
            {
                type: 'mysql',
                host: '127.0.0.1',
                port: 3306,
                database: configure.env.get('DB_NAME', 'testing'),
                username: configure.env.get('DB_USERNAME', 'root'),
                password: configure.env.get('DB_PASSWORD', '123456'),
                factories: [
                    /* UserFactory, ContentFactory */
                ],
                seeders: [/* UserSeeder, ContentSeeder, */ MenuSeeder],
            },
        ],
    }
})
