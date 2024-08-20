import { PartialType } from '@nestjs/swagger'

import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator'

import { DtoValidation } from '@/helpers/decorators'

import { PaginateWithTrashedDto } from '@/helpers/dtos'
import { IsDataExist } from '@/modules/database/constraints'

import { DictEntity } from '../entities'

@DtoValidation({ type: 'query' })
export class QueryDictItemDto extends PaginateWithTrashedDto {
    @IsDataExist(DictEntity, {
        always: true,
        message: '所属的字典不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsDefined({ message: 'ID必须指定' })
    dict: string
}

@DtoValidation({ groups: ['create'] })
export class CreateDictItemDto {
    @MaxLength(20, {
        always: true,
        message: '标签名长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '标签名必须填写' })
    @IsOptional({ groups: ['update'] })
    label: string

    @MaxLength(100, {
        always: true,
        message: '数据值长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '数据值必须填写' })
    @IsOptional({ groups: ['update'] })
    value: string

    @MaxLength(500, {
        always: true,
        message: '备注长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    description?: string

    @IsOptional({ groups: ['create', 'update'] })
    sortOrder?: number

    @MaxLength(500, {
        always: true,
        message: '备注长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    remark?: string

    @IsOptional({ groups: ['create', 'update'] })
    status?: boolean

    @IsDataExist(DictEntity, {
        message: '字典不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '字典ID格式不正确',
    })
    @IsOptional({ groups: ['update'] })
    dict: string
}

@DtoValidation({ groups: ['update'] })
export class UpdateDictItemDto extends PartialType(CreateDictItemDto) {
    @IsUUID(undefined, { groups: ['update'], message: 'ID格式错误' })
    @IsDefined({ groups: ['update'], message: 'ID必须指定' })
    id: string
}
