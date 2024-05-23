import { PartialType } from '@nestjs/swagger'
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator'

import { DtoValidation } from '@/helpers/decorators'
import { PaginateWithTrashedDto } from '@/helpers/dtos'
import { IsDataExist } from '@/modules/database/constraints'
import { UserEntity } from '@/modules/user/entities'

import { PermissionEntity } from '../entities'

export class QueryRoleDto extends PaginateWithTrashedDto {
    @IsDataExist(UserEntity, {
        groups: ['update'],
        message: '指定的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    user?: string
}

export class CreateRoleDto {
    @MaxLength(100, {
        always: true,
        message: '名称长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '名称必须填写' })
    @IsOptional({ groups: ['update'] })
    name: string

    @MaxLength(100, {
        always: true,
        message: '名称长度最大为$constraint1',
    })
    label: string

    @MaxLength(500, {
        always: true,
        message: '名称长度最大为$constraint1',
    })
    description?: string

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

@DtoValidation({ groups: ['update'] })
export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsUUID(undefined, { groups: ['update'], message: 'ID格式错误' })
    @IsDefined({ groups: ['update'], message: 'ID必须指定' })
    id: string
}
