import { toNumber } from 'lodash'

import { createAppConfig } from '@/bootstrap/app'
import { Configure } from '@/modules/config/configure'

export const app = createAppConfig((configure: Configure) => ({
    port: configure.env.get('APP_PORT', (v) => toNumber(v), 2121),
    prefix: 'api',
    prefixManage: 'manage/api',
    // prefixGlobal: 'APP_NAME',
    pm2: {
        exec_mode: 'cluster',
    },
}))
