type ListItems<T> = T[]

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

export interface ReqQueryParams {
    page?: number
    limit?: number
    search?: string
    [key: string]: any
}

export interface ReqDeleteParams {
    ids: string[]
}

export interface ReqRestoreParams {
    ids: string[]
}
