import { ApiConfig, VersionOption } from '@/helpers/types'
import { Configure } from '@/modules/config/configure'
import { ConfigureFactory } from '@/modules/config/types'

import { createContentApi } from '@/modules/content/routes'
import { createDictApi } from '@/modules/dict/routes'
import { createRbacApi } from '@/modules/rbac/routes'
import { createUserApi } from '@/modules/user/routes'

export const api: ConfigureFactory<ApiConfig> = {
    register: async (configure: Configure) => ({
        title: configure.env.get('API_TITLE', 'KR Admin'),
        description: configure.env.get('API_DESCRIPTION', 'KR Nest Admin Management System'),
        auth: true,
        docuri: 'docs',
        versionDefault: configure.env.get('API_DEFAULT_VERSION', 'v1'),
        enabled: [],
        versions: { v1: await v1(configure) },
    }),
}

export const v1 = async (configure: Configure): Promise<VersionOption> => {
    const userApi = createUserApi()
    const rbacApi = createRbacApi()
    const contentApi = createContentApi()
    const dictApi = createDictApi()
    return {
        routes: [
            {
                name: 'app',
                path: '/',
                controllers: [],
                doc: {
                    title: '应用接口',
                    description: '客户端接口',
                    tags: [
                        ...contentApi.tags.app,
                        ...userApi.tags.app,
                        ...rbacApi.tags.app,
                        ...dictApi.tags.app,
                    ],
                },
                children: [
                    ...contentApi.routes.app,
                    ...userApi.routes.app,
                    ...rbacApi.routes.app,
                    ...dictApi.routes.app,
                ],
            },
            {
                name: 'manage',
                path: 'manage', // doc uri
                controllers: [],
                doc: {
                    title: '管理端接口',
                    description: '应用的后台管理接口',
                    tags: [
                        ...contentApi.tags.manage,
                        ...userApi.tags.manage,
                        ...rbacApi.tags.manage,
                        ...dictApi.tags.manage,
                    ],
                },
                children: [
                    ...contentApi.routes.manage,
                    ...userApi.routes.manage,
                    ...rbacApi.routes.manage,
                    ...dictApi.routes.manage,
                ],
            },
        ],
    }
}
