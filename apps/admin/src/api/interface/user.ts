import { HttpMethod, OperationType } from '@/utils/constants'

import { ReqQueryParams } from '.'

import { UserInfo as UserInfoEntity } from '#/entity'

export interface LoginLogProp {
  id: string
  login_time?: string
  login_ip?: string
  login_device?: string
  status?: string
  fail_reason?: string
  user: UserInfoEntity
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
  user: UserInfoEntity
}

export interface ReqQueryTokenParams extends ReqQueryParams {}
