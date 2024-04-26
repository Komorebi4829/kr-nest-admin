import { PickType, PartialType, OmitType } from '@nestjs/swagger'
import { IsDefined, IsEnum, IsOptional, IsUUID } from 'class-validator'

import { DtoValidation } from '@/helpers/decorators'
import { PaginateWithTrashedDto } from '@/helpers/dtos'
import { IsDataExist } from '@/modules/database/constraints'
import { PermissionEntity, RoleEntity } from '@/modules/rbac/entities'

import { UserOrderType, UserValidateGroups } from '../constants'

import { UserCommonDto } from './common.dto'

@DtoValidation({ groups: [UserValidateGroups.USER_CREATE] })
export class CreateUserDto extends PickType(UserCommonDto, [
    'username',
    'nickname',
    'password',
    'phone',
    'email',
]) {
    @IsDataExist(RoleEntity, {
        each: true,
        always: true,
        message: '角色不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '角色ID格式不正确',
    })
    @IsOptional({ always: true })
    roles?: string[]

    @IsDataExist(PermissionEntity, {
        each: true,
        always: true,
        message: '权限不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '权限ID格式不正确',
    })
    @IsOptional({ always: true })
    permissions?: string[]
}

@DtoValidation({ groups: [UserValidateGroups.USER_UPDATE] })
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsUUID(undefined, { groups: [UserValidateGroups.USER_UPDATE], message: '用户ID格式不正确' })
    @IsDefined({ groups: ['update'], message: '用户ID必须指定' })
    id: string
}

@DtoValidation({ type: 'query' })
export class QueryUserDto extends PaginateWithTrashedDto {
    @IsDataExist(RoleEntity, {
        message: '角色不存在',
    })
    @IsUUID(undefined, { message: '角色ID格式错误' })
    @IsOptional()
    role?: string

    @IsDataExist(PermissionEntity, {
        message: '权限不存在',
    })
    @IsUUID(undefined, { message: '权限ID格式错误' })
    @IsOptional()
    permission?: string

    @IsEnum(UserOrderType)
    orderBy?: UserOrderType
}

@DtoValidation({ type: 'query' })
export class AppQueryUserDto extends OmitType(QueryUserDto, ['trashed']) {}
