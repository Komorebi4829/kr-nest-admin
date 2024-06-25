import apiClient from '@/utils/http/apiClient'

import { ReqDeleteParams, ReqQueryParams, RespListData, RespDetailData } from './interface'
import { TokenProp } from './interface/token'

export enum TokenApi {
  ManageToken = '/manage/api/user/tokens',
}

export const getTokenList = (params: ReqQueryParams) =>
  apiClient.get<RespListData<TokenProp>>({ url: `${TokenApi.ManageToken}`, params })
export const deleteToken = (data: ReqDeleteParams) =>
  apiClient.delete<RespDetailData<TokenProp>[]>({ url: `${TokenApi.ManageToken}`, data })
