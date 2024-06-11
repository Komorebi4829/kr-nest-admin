import { PostOrderType } from '@/utils/constants'

import { ReqQueryParams } from '.'

export interface PostProp {
    id: string
    title: string
    summary: string
    keywords: string[] | null
    type: string
    publishedAt: string | null
    customOrder: number
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    commentCount: number
    category: Pick<CategoryProp, 'id' | 'name'>
    tags?: Tag[] | null
    author: Author
}

export interface Tag {
    id: string
    name: string
    description?: string | null
}

export interface Author {
    id: string
    nickname: string
    username: string
    phone: string | null
    email: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    permissions: string[]
}

export interface ReqQueryPostParams extends ReqQueryParams {
    isPublished?: boolean
    category?: string
    tags?: string[]
    orderBy?: PostOrderType
}

export interface ReqCreatePostParams {
    title: string
    body: string
    summary?: string
    keywords?: string[]
    customOrder?: number
    category: string
    tags?: string[]
}

export type ReqUpdatePostParams = Partial<ReqCreatePostParams> & { id: string }

export interface CategoryProp {
    id: string
    name: string
    customOrder?: number
    depth?: number
    parent: CategoryProp | null
}

export type CategoryTreeProp = Omit<CategoryProp, 'parent' | 'depth'> & {
    children: CategoryTreeProp
}

export type ReqCreateCategoryParams = Pick<CategoryProp, 'name'> & {
    parent?: string
}

export type ReqUpdateCategoryParams = Partial<ReqCreateCategoryParams> & { id: string }

export interface TagProp {
    id: string
    name: string
    description: string | null
    postCount: number
}

export type ReqCreateTagParams = Pick<TagProp, 'name' | 'description'>

export type ReqUpdateTagParams = Partial<ReqCreateTagParams> & { id: string }

export interface CommentProp {
    id: string
    body: string
    createdAt: string
    depth: number
    post: PostProp
    parent: CommentProp | null
    children: CommentProp[]
    author: Author
}
