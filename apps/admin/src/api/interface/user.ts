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

export interface ReqQueryTokenParams extends ReqQueryParams {}
