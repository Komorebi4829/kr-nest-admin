import merge from 'deepmerge'
import { ConfigEnv, UserConfig } from 'vite'

import { createPlugins } from './plugins'
import { Configure } from './types'
import { pathResolve } from './utils'

export const createConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build'
    return merge<UserConfig>(
        {
            resolve: {
                alias: {
                    '@': pathResolve('src'),
                },
            },
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly',
                },
            },
            server: {
                port: 2221,
                proxy: {
                    '/api/client': {
                        target: 'http://127.0.0.1:2121',
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/api\/client/, '/api'),
                    },
                    '/api/manage': {
                        target: 'http://127.0.0.1:2121',
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/api\/manage/, '/manage/api'),
                    },
                },
                cors: true,
            },
            plugins: createPlugins(isBuild),
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    )
}
