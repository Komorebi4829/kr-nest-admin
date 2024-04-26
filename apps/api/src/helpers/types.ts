import { Type } from '@nestjs/common'
import { ExternalDocumentationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { ClassTransformOptions } from 'class-transformer'

export type CurdMethod = 'detail' | 'delete' | 'restore' | 'list' | 'store' | 'update'

export interface CrudMethodOption {
    allowGuest?: boolean

    serialize?: ClassTransformOptions | 'noGroup'
    hook?: (target: Type<any>, method: string) => void
}

export interface CurdItem {
    name: CurdMethod
    option?: CrudMethodOption
}

export interface CurdOptions {
    id: string
    enabled: Array<CurdMethod | CurdItem>
    dtos: {
        [key in 'list' | 'store' | 'update']?: Type<any>
    }
}

export interface ApiConfig extends ApiDocSource {
    docuri?: string
    versionDefault: string
    enabled: string[]
    versions: Record<string, VersionOption>
}

export interface VersionOption extends ApiDocSource {
    routes?: RouteOption[]
}

export interface RouteOption {
    name: string
    path: string
    controllers: Type<any>[]
    children?: RouteOption[]
    doc?: ApiDocSource
}

export interface SwaggerOption extends ApiDocSource {
    version: string
    path: string
    include: Type<any>[]
}

export interface APIDocOption {
    default?: SwaggerOption
    routes?: { [key: string]: SwaggerOption }
}

export interface ApiDocSource {
    title?: string
    description?: string
    auth?: boolean
    tags?: (string | TagOption)[]
}

export interface TagOption {
    name: string
    description?: string
    externalDocs?: ExternalDocumentationObject
}
