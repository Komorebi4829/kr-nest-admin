import apiClient from '@/utils/http/apiClient'

import { Permission } from '#/entity'

export enum MenuApi {
    MenuTree = '/manage/api/rbac/menus/tree',
    Menu = '/manage/api/rbac/menus',
}

const getMenuTree = () => apiClient.get<Permission[]>({ url: `${MenuApi.MenuTree}` })
const getMenuList = (params: any) => apiClient.get<Permission[]>({ url: `${MenuApi.Menu}`, params })
const createMenu = (data: any) => apiClient.post<Permission[]>({ url: `${MenuApi.Menu}`, data })
const updateMenu = (data: any) =>
    apiClient.patch<Permission[]>({ url: `${MenuApi.Menu}`, data })
const deleteMenu = (data: any) =>
    apiClient.delete<Permission[]>({ url: `${MenuApi.Menu}`, data })
const getMenuDetail = (id: string) => apiClient.get<Permission[]>({ url: `${MenuApi.Menu}/${id}` })

export default {
    getMenuTree,
    getMenuList,
    createMenu,
    updateMenu,
    deleteMenu,
    getMenuDetail,
}
