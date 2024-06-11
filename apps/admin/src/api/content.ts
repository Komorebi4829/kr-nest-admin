import apiClient from '@/utils/http/apiClient'

import {
    ReqDeleteParams,
    ReqQueryParams,
    ReqRestoreParams,
    RespListData,
    RespDetailData,
    RespTreeData,
} from './interface'
import {
    CategoryProp,
    CategoryTreeProp,
    CommentProp,
    PostProp,
    ReqCreateCategoryParams,
    ReqCreatePostParams,
    ReqCreateTagParams,
    ReqQueryPostParams,
    ReqUpdateCategoryParams,
    ReqUpdatePostParams,
    ReqUpdateTagParams,
    TagProp,
} from './interface/content'

export enum PostApi {
    ClientPost = '/api/content/posts',
    ManagePost = '/manage/api/content/posts',
    ManagePostRestore = '/manage/api/content/posts/restore',
}

export enum TagApi {
    ClientTag = '/api/content/tags',
    ManageTag = '/manage/api/content/tags',
}

export enum CategoryApi {
    ClientCategory = '/api/content/categories',
    ClientCategoryTree = '/api/content/categories/tree',
    ManageCategory = '/manage/api/content/categories',
}

export enum CommentApi {
    ClientComment = '/api/content/comments',
    ManageComment = '/manage/api/content/comments',
}

export const getPostList = (params: ReqQueryPostParams) =>
    apiClient.get<RespListData<PostProp>>({ url: `${PostApi.ManagePost}`, params })
export const createPost = (data: ReqCreatePostParams) =>
    apiClient.post<RespDetailData<PostProp>>({ url: `${PostApi.ManagePost}`, data })
export const updatePost = (data: ReqUpdatePostParams) =>
    apiClient.patch<RespDetailData<PostProp>>({ url: `${PostApi.ManagePost}`, data })
export const deletePost = (data: ReqDeleteParams) =>
    apiClient.delete<RespDetailData<PostProp>[]>({ url: `${PostApi.ManagePost}`, data })
export const getPostDetail = (id: string) =>
    apiClient.get<RespDetailData<PostProp>>({ url: `${PostApi.ManagePost}/${id}` })
export const restorePost = (data: ReqRestoreParams) =>
    apiClient.patch<any>({ url: `${PostApi.ManagePostRestore}`, data })

export const getTagList = (params: ReqQueryParams) =>
    apiClient.get<RespListData<TagProp>>({ url: `${TagApi.ManageTag}`, params })
export const createTag = (data: ReqCreateTagParams) =>
    apiClient.post<RespDetailData<TagProp>>({ url: `${TagApi.ManageTag}`, data })
export const updateTag = (data: ReqUpdateTagParams) =>
    apiClient.patch<RespDetailData<TagProp>>({ url: `${TagApi.ManageTag}`, data })
export const deleteTag = (data: ReqDeleteParams) =>
    apiClient.delete<RespDetailData<TagProp>[]>({ url: `${TagApi.ManageTag}`, data })
export const getTagDetail = (id: string) =>
    apiClient.get<RespDetailData<TagProp>>({ url: `${TagApi.ManageTag}/${id}` })

export const getCategoryList = (params: ReqQueryParams) =>
    apiClient.get<RespListData<CategoryProp>>({ url: `${CategoryApi.ManageCategory}`, params })
export const createCategory = (data: ReqCreateCategoryParams) =>
    apiClient.post<RespDetailData<CategoryProp>>({ url: `${CategoryApi.ManageCategory}`, data })
export const updateCategory = (data: ReqUpdateCategoryParams) =>
    apiClient.patch<RespDetailData<CategoryProp>>({ url: `${CategoryApi.ManageCategory}`, data })
export const deleteCategory = (data: ReqDeleteParams) =>
    apiClient.delete<RespDetailData<CategoryProp>[]>({ url: `${CategoryApi.ManageCategory}`, data })
export const getCategoryDetail = (id: string) =>
    apiClient.get<RespDetailData<CategoryProp>>({ url: `${CategoryApi.ManageCategory}/${id}` })
export const getCategoryTree = () =>
    apiClient.get<RespTreeData<CategoryTreeProp>>({ url: `${CategoryApi.ClientCategoryTree}` })

export const getCommentList = (params: ReqQueryParams) =>
    apiClient.get<RespListData<CommentProp>>({ url: `${CommentApi.ManageComment}`, params })
export const deleteComment = (data: ReqDeleteParams) =>
    apiClient.delete<RespDetailData<CommentProp>[]>({ url: `${CommentApi.ManageComment}`, data })
