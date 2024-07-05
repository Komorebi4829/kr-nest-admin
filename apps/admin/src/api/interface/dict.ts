import { ReqQueryParams } from '.'

export interface DictProp {
  id: string
  code: string
  name: string
  systemFlag: number
  remark?: string
  status?: number
}

export interface DictItemProp {
  id: string
  label: string
  value: string
  description: string
  sortOrder: number
  remark: string
  status?: number
  dict: DictProp
}

export interface ReqQueryDictParams extends ReqQueryParams {}

export interface ReqCreateDictParams extends Omit<DictProp, 'id'> {}

export type ReqUpdateDictParams = Partial<ReqCreateDictParams> & { id: string }

export interface ReqQueryDictItemParams extends ReqQueryParams {
  dict: string
}

export interface ReqCreateDictItemParams extends Omit<DictItemProp, 'id'> {}

export type ReqUpdateDictItemParams = Partial<ReqCreateDictItemParams> & { id: string }
