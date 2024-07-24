import apiClient from '@/utils/http/apiClient'

import {
  ReqDeleteParams,
  ReqQueryParams,
  ReqRestoreParams,
  RespDetailData,
  RespListData,
} from './interface'
import { LoginLogProp, OperationLogProp, ReqQueryUserParams, UserProp } from './interface/user'

import { Permission, UserInfo as UserInfoEntity, UserToken } from '#/entity'

export interface SignInReq {
  credential: string
  password: string
}

export interface SignUpReq extends SignInReq {
  email: string
}
export type SignInRes = UserToken & { user: UserInfoEntity }

export enum UserApi {
  SignIn = '/api/user/account/login',
  SignUp = '/api/user/account/register',
  Logout = '/api/user/account/logout',
  Refresh = '/auth/refresh',
  UserInfo = '/api/user/account/profile',
  MenuTree = '/manage/api/rbac/menus/tree',
  LoginLog = '/manage/api/user/login-log',
  OperationLog = '/manage/api/user/operation-log',

  ManageUser = '/manage/api/user/users',
  ManageUserRestore = '/manage/api/user/users/restore',
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data })
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data })
const logout = () => apiClient.get({ url: UserApi.Logout })
const getUserInfo = () => apiClient.get<UserInfoEntity>({ url: `${UserApi.UserInfo}` })
const getMenuTree = () => apiClient.get<Permission[]>({ url: `${UserApi.MenuTree}` })
const getLoginLogList = (params: ReqQueryParams) =>
  apiClient.get<RespListData<LoginLogProp>>({ url: `${UserApi.LoginLog}`, params })
const getOperationLogList = (params: ReqQueryParams) =>
  apiClient.get<RespListData<OperationLogProp>>({ url: `${UserApi.OperationLog}`, params })
export const getUserList = (params: ReqQueryUserParams) =>
  apiClient.get<RespListData<UserProp>>({ url: `${UserApi.ManageUser}`, params })
export const deleteUser = (data: ReqDeleteParams) =>
  apiClient.delete<RespDetailData<UserProp>[]>({ url: `${UserApi.ManageUser}`, data })
export const getUserDetail = (id: string) =>
  apiClient.get<RespDetailData<UserProp>>({ url: `${UserApi.ManageUser}/${id}` })
export const restoreUser = (data: ReqRestoreParams) =>
  apiClient.patch<any>({ url: `${UserApi.ManageUserRestore}`, data })

export default {
  signin,
  signup,
  getUserInfo,
  getMenuTree,
  logout,
  getLoginLogList,
  getOperationLogList,
}
