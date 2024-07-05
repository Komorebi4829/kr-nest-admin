import apiClient from '@/utils/http/apiClient'

import { ReqDeleteParams, RespListData, RespDetailData } from './interface'
import {
  DictProp,
  DictItemProp,
  ReqQueryDictParams,
  ReqCreateDictParams,
  ReqUpdateDictParams,
  ReqQueryDictItemParams,
  ReqCreateDictItemParams,
  ReqUpdateDictItemParams,
} from './interface/dict'

export enum DictApi {
  ManageDict = '/manage/api/dict/dicts',
  ClientDict = '/api/dict/dicts',
}

export enum DictItemApi {
  ManageDictItem = '/manage/api/dict/dict-items',
  ClientDictItem = '/api/dict/dict-items',
}

export const getDictList = (params: ReqQueryDictParams) =>
  apiClient.get<RespListData<DictProp>>({ url: `${DictApi.ManageDict}`, params })
export const createDict = (data: ReqCreateDictParams) =>
  apiClient.post<RespDetailData<DictProp>>({ url: `${DictApi.ManageDict}`, data })
export const updateDict = (data: ReqUpdateDictParams) =>
  apiClient.patch<RespDetailData<DictProp>>({ url: `${DictApi.ManageDict}`, data })
export const deleteDict = (data: ReqDeleteParams) =>
  apiClient.delete<RespDetailData<DictProp>[]>({ url: `${DictApi.ManageDict}`, data })
export const getDictDetail = (id: string) =>
  apiClient.get<RespDetailData<DictProp>>({ url: `${DictApi.ManageDict}/${id}` })

export const getDictItemList = (params: ReqQueryDictItemParams) =>
  apiClient.get<RespListData<DictItemProp>>({ url: `${DictItemApi.ManageDictItem}`, params })
export const createDictItem = (data: ReqCreateDictItemParams) =>
  apiClient.post<RespDetailData<DictItemProp>>({ url: `${DictItemApi.ManageDictItem}`, data })
export const updateDictItem = (data: ReqUpdateDictItemParams) =>
  apiClient.patch<RespDetailData<DictItemProp>>({ url: `${DictItemApi.ManageDictItem}`, data })
export const deleteDictItem = (data: ReqDeleteParams) =>
  apiClient.delete<RespDetailData<DictItemProp>[]>({ url: `${DictItemApi.ManageDictItem}`, data })
export const getDictItemDetail = (id: string) =>
  apiClient.get<RespDetailData<DictItemProp>>({ url: `${DictItemApi.ManageDictItem}/${id}` })
