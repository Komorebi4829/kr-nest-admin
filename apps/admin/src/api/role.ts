import apiClient from '@/utils/http/apiClient'

import { Role as RoleEntity } from '#/entity'

export enum RoleApi {
  ClientRole = '/api/rbac/roles',
  ManageRole = '/manage/api/rbac/roles',
}

const getRoleList = (params) =>
  apiClient.get<RoleEntity[]>({ url: `${RoleApi.ClientRole}`, params })
const createRole = (data) => apiClient.post<RoleEntity[]>({ url: `${RoleApi.ManageRole}`, data })
const updateRole = (data) => apiClient.patch<RoleEntity[]>({ url: `${RoleApi.ManageRole}`, data })
const deleteRole = (data) => apiClient.delete<RoleEntity[]>({ url: `${RoleApi.ManageRole}`, data })
const getRoleDetail = (id: string) =>
  apiClient.get<RoleEntity>({ url: `${RoleApi.ClientRole}/${id}` })

export default {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  getRoleDetail,
}
