import { BasicStatus, PermissionType } from './enum'

export interface UserToken {
    accessToken?: string
    refreshToken?: string
}

export interface UserInfo {
    id: string
    email: string
    username: string
    nickname?: string
    password?: string
    avatar?: string
    phone?: string
    role?: Role
    status?: BasicStatus
    permissions?: Permission[]
}

export interface Organization {
    id: string
    name: string
    status: 'enable' | 'disable'
    desc?: string
    order?: number
    children?: Organization[]
}

export interface Permission {
    id: string
    label: string
    name: string
    type: PermissionType
    icon?: string
    customOrder?: number
    isFrame?: boolean
    frameSrc?: string
    isCache?: boolean
    path: string
    component?: string
    perms?: string
    query?: string
    hide?: boolean
    status?: BasicStatus
    newFeature?: boolean
    hideTab?: boolean
    parentId?: string
    children?: Permission[]
}

export interface Role {
    id: string
    name: string
    label: string
    status: BasicStatus
    order?: number
    desc?: string
    permission?: Permission[]
}
