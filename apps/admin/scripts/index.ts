import merge from 'deepmerge';
import { ConfigEnv, UserConfig } from 'vite';

import { createPlugins } from './plugins';
import { Configure } from './types';
import { pathResolve } from './utils';

export const createConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
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
                proxy: {
                    '/api': {
                        target: 'http://localhost:3100/api',
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/api/, ''),
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
    );
};
