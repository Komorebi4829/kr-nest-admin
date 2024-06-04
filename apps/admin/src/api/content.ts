import apiClient from '@/utils/http/apiClient'

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
    ManageCategory = '/manage/api/content/categories',
}

export enum CommentApi {
    ClientComment = '/api/content/comments',
    ManageComment = '/manage/api/content/comments',
}

export const getPostList = (params) => apiClient.get<any>({ url: `${PostApi.ManagePost}`, params })
export const createPost = (data) => apiClient.post<any>({ url: `${PostApi.ManagePost}`, data })
export const updatePost = (data) => apiClient.patch<any>({ url: `${PostApi.ManagePost}`, data })
export const deletePost = (data) => apiClient.delete<any>({ url: `${PostApi.ManagePost}`, data })
export const getPostDetail = (id: string) =>
    apiClient.get<any>({ url: `${PostApi.ManagePost}/${id}` })
export const restorePost = (data) =>
    apiClient.patch<any>({ url: `${PostApi.ManagePostRestore}`, data })

export const getTagList = (params) => apiClient.get<any>({ url: `${TagApi.ManageTag}`, params })
export const createTag = (data) => apiClient.post<any>({ url: `${TagApi.ManageTag}`, data })
export const updateTag = (data) => apiClient.patch<any>({ url: `${TagApi.ManageTag}`, data })
export const deleteTag = (data) => apiClient.delete<any>({ url: `${TagApi.ManageTag}`, data })
export const getTagDetail = (id: string) => apiClient.get<any>({ url: `${TagApi.ManageTag}/${id}` })

export const getCategoryList = (params) =>
    apiClient.get<any>({ url: `${CategoryApi.ManageCategory}`, params })
export const createCategory = (data) =>
    apiClient.post<any>({ url: `${CategoryApi.ManageCategory}`, data })
export const updateCategory = (data) =>
    apiClient.patch<any>({ url: `${CategoryApi.ManageCategory}`, data })
export const deleteCategory = (data) =>
    apiClient.delete<any>({ url: `${CategoryApi.ManageCategory}`, data })
export const getCategoryDetail = (id: string) =>
    apiClient.get<any>({ url: `${CategoryApi.ManageCategory}/${id}` })

export const getCommentList = (params) =>
    apiClient.get<any>({ url: `${CommentApi.ManageComment}`, params })
export const deleteComment = (data) =>
    apiClient.delete<any>({ url: `${CommentApi.ManageComment}`, data })
