import apiClient from '@/utils/http/apiClient'

import { Permission } from '#/entity'

export enum MenuApi {
    MenuTree = '/manage/api/rbac/menus/tree',
}

const getMenuTree = () => apiClient.get<Permission[]>({ url: `${MenuApi.MenuTree}` })

export default {
    getMenuTree,
}
