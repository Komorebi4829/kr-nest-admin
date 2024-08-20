export type TreeOptions = {
  title: string
  value: string
  children?: TreeOptions[]
}

type ListItems<T> = T[]

export interface ReqQueryParams {
  page?: number
  limit?: number
  [key: string]: any
}

export interface ReqDeleteParams {
  ids: string[]
}

export interface ReqRestoreParams {
  ids: string[]
}

type PaginateMeta = {
  currentPage: number
  itemCount: number
  perPage: number
  totalItems: number
  totalPages: number
}

export interface RespListData<T> {
  items: ListItems<T>
  meta: PaginateMeta
}

export type RespDetailData<T> = T

export type RespTreeData<T> = ListItems<T>
