import { RouteOption, TagOption } from '@/helpers/types'

import * as controllers from './controllers'
import * as manageControllers from './controllers/manage'

export const createDictApi = () => {
    const routes: Record<'app' | 'manage', RouteOption[]> = {
        app: [
            {
                name: 'app.dict',
                path: 'dict',
                controllers: Object.values(controllers),
            },
        ],
        manage: [
            {
                name: 'manage.dict',
                path: 'dict',
                controllers: Object.values(manageControllers),
            },
        ],
    }
    const tags: Record<'app' | 'manage', Array<string | TagOption>> = {
        app: [
            { name: '字典信息', description: '查询字典头信息' },
            { name: '字典项信息', description: '查询字典项信息' },
        ],
        manage: [
            { name: '字典管理', description: '对字典头进行CRUD操作' },
            { name: '字典项管理', description: '对字典项进行CRUD操作' },
        ],
    }
    return { routes, tags }
}
