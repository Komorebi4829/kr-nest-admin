import { ReqQueryParams } from '.'

export interface TokenProp {
  id: string
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

export interface ReqQueryTokenParams extends ReqQueryParams {}
