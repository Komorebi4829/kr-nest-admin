import { HttpMethod, OperationType } from '@/utils/constants'

import { ReqQueryParams } from '.'

import { Permission, Role } from '#/entity'

export interface LoginLogProp {
  id: string
  login_time?: string
  login_ip?: string
  login_device?: string
  status?: string
  fail_reason?: string
  user: UserProp
}

export interface OperationLogProp {
  id: string
  operation_name: string
  operation_type: OperationType
  operation_time: Date
  operation_ip: string
  operation_device?: string
  operation_url?: string
  status?: string
  fail_reason?: string
  time?: string
  method?: HttpMethod
  user: UserProp
}

export interface ReqQueryTokenParams extends ReqQueryParams {}

export interface UserProp {
  id: string
  email: string
  username: string
  nickname?: string
  avatar?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  roles?: Role[]
  permissions?: Permission[]
}

export interface ReqQueryUserParams extends ReqQueryParams {}
