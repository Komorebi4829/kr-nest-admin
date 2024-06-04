import { PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

import {
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator'
import { toNumber } from 'lodash'

import { DtoValidation } from '@/helpers/decorators'
import { SelectTrashMode } from '@/modules/database/constants'
import { IsDataExist, IsTreeUnique, IsTreeUniqueExist } from '@/modules/database/constraints'

import { MenuEntity } from '../entities'

@DtoValidation({ type: 'query' })
export class QueryMenuTreeDto {
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode
}

@DtoValidation({ groups: ['create'] })
export class CreateMenuDto {
    @IsTreeUnique(MenuEntity, {
        groups: ['create'],
        message: '菜单label重复',
    })
    @IsTreeUniqueExist(MenuEntity, {
        groups: ['update'],
        message: 'label重复',
    })
    @MaxLength(100, {
        always: true,
        message: '菜单label长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '菜单label不得为空' })
    @IsOptional({ groups: ['update'] })
    label: string

    @IsTreeUnique(MenuEntity, {
        groups: ['create'],
        message: '菜单名称重复',
    })
    @IsTreeUniqueExist(MenuEntity, {
        groups: ['update'],
        message: '名称重复',
    })
    @MaxLength(24, {
        always: true,
        message: '菜单名称长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '菜单名称不得为空' })
    @IsOptional({ groups: ['update'] })
    name: string

    @IsNotEmpty({ groups: ['create'], message: '菜单类型不得为空' })
    @IsOptional({ groups: ['update'] })
    type: number

    @IsNotEmpty({ groups: ['create'], message: '路由地址不得为空' })
    @IsOptional({ groups: ['update'] })
    path: string

    @IsOptional({ groups: ['create', 'update'] })
    isFrame?: boolean

    @IsOptional({ groups: ['create', 'update'] })
    frameSrc?: string

    @IsOptional({ groups: ['create', 'update'] })
    newFeature?: boolean

    @IsOptional({ groups: ['create', 'update'] })
    hideTab?: boolean

    @IsOptional({ groups: ['create', 'update'] })
    component?: string

    @IsOptional({ groups: ['create', 'update'] })
    hide?: boolean

    @IsOptional({ groups: ['create', 'update'] })
    isCache?: boolean

    @IsOptional({ groups: ['create', 'update'] })
    status?: number

    @IsOptional({ groups: ['create', 'update'] })
    icon?: string

    @IsDataExist(MenuEntity, { always: true, message: '父菜单不存在' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string

    @Transform(({ value }) => toNumber(value))
    @Min(1, { always: true, message: '排序值必须大于1' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    customOrder?: number = 1
}

@DtoValidation({ groups: ['update'] })
export class UpdateMenuDto extends PartialType(CreateMenuDto) {
    @IsUUID(undefined, { groups: ['update'], message: 'ID格式错误' })
    @IsDefined({ groups: ['update'], message: 'ID必须指定' })
    id: string
}
