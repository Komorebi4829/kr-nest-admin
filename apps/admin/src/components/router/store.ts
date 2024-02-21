import { config } from '@/config'
import { deepMerge } from '@/utils'

import { createStore } from '../store'

import { getDefaultRouterConfig } from './_default.config'
import { RouterState } from './types'

/**
 * 路由状态池
 */
export const RouterStore = createStore<RouterState>(() => ({
    ready: false,
    routes: [],
    menus: [],
    flat: [],
    config: deepMerge(getDefaultRouterConfig(), config().router ?? {}, 'replace'),
}))
