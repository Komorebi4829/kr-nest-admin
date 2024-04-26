import { toNumber } from 'lodash'

import { Configure } from '@/modules/config/configure'
import { toBoolean } from '@/utils/common'

import { getRandomCharString } from './utils'

export const getDefaultAppConfig = (configure: Configure) => ({
    name: configure.env.get('APP_NAME', getRandomCharString(9)),
    host: configure.env.get('APP_HOST', '127.0.0.1'),
    port: configure.env.get('APP_PORT', (v) => toNumber(v), 3000),
    https: configure.env.get('APP_SSL', (v) => toBoolean(v), false),
    timezone: configure.env.get('APP_TIMEZONE', 'Asia/Shanghai'),
    locale: configure.env.get('APP_LOCALE', 'zh_CN'),
    fallbackLocale: configure.env.get('APP_FALLBACK_LOCALE', 'en'),
})
