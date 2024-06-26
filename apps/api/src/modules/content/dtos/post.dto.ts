import { OmitType, PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

import {
    IsBoolean,
    IsDateString,
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

import { isNil, toNumber } from 'lodash'

import { DtoValidation } from '@/helpers/decorators'
import { PaginateWithTrashedDto } from '@/helpers/dtos'
import { IsDataExist } from '@/modules/database/constraints'

import { UserEntity } from '@/modules/user/entities'

import { toBoolean } from '@/utils/common'

import { PostOrderType } from '../constants'
import { CategoryEntity, TagEntity } from '../entities'

@DtoValidation({ type: 'query' })
export class QueryPostDto extends PaginateWithTrashedDto {
    @MaxLength(100, {
        always: true,
        message: '搜索字符串长度不得超过$constraint1',
    })
    @IsOptional({ always: true })
    search?: string

    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean

    @IsEnum(PostOrderType, {
        message: `排序规则必须是${Object.values(PostOrderType).join(',')}其中一项`,
    })
    @IsOptional()
    orderBy?: PostOrderType

    @IsDataExist(CategoryEntity, {
        always: true,
        message: '分类不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsOptional()
    category?: string

    @IsDataExist(TagEntity, {
        always: true,
        message: '标签不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsOptional()
    tag?: string

    @IsDataExist(UserEntity, {
        message: '指定的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    author?: string
}

@DtoValidation({ groups: ['create'] })
export class CreatePostDto {
    @MaxLength(255, {
        always: true,
        message: '文章标题长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    @IsOptional({ groups: ['update'] })
    title: string

    @IsNotEmpty({ groups: ['create'], message: '文章内容必须填写' })
    @IsOptional({ groups: ['update'] })
    body: string

    @MaxLength(500, {
        always: true,
        message: '文章描述长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    summary?: string

    @IsDateString({ strict: true }, { always: true })
    @IsOptional({ always: true })
    @ValidateIf((value) => !isNil(value.publishedAt))
    @Transform(({ value }) => (value === 'null' ? null : value))
    publishedAt?: Date

    @MaxLength(20, {
        each: true,
        always: true,
        message: '每个关键字长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    keywords?: string[]

    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    customOrder?: number = 0

    @IsDataExist(CategoryEntity, {
        message: '分类不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'ID格式不正确',
    })
    @IsOptional({ groups: ['update'] })
    category: string

    @IsDataExist(TagEntity, {
        each: true,
        always: true,
        message: '标签不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'ID格式不正确',
    })
    @IsNotEmpty({ groups: ['create'], message: '分类必须设置' })
    @IsOptional({ always: true })
    tags?: string[]

    @IsDataExist(UserEntity, {
        always: true,
        message: '用户不存在',
    })
    @IsUUID(undefined, {
        always: true,
        message: '用户ID格式不正确',
    })
    @IsOptional({ always: true })
    author?: string
}

@DtoValidation({ type: 'query' })
export class QueryFrontendPostDto extends OmitType(QueryPostDto, ['isPublished', 'trashed']) {}

@DtoValidation({ type: 'query' })
export class QueryOwnerPostDto extends OmitType(QueryPostDto, ['author']) {}

@DtoValidation({ groups: ['create'] })
export class CreateUserPostDto extends OmitType(CreatePostDto, ['author', 'customOrder']) {
    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    userOrder?: number = 0
}

@DtoValidation({ groups: ['update'] })
export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    id: string
}

@DtoValidation({ groups: ['update'] })
export class UpdateUserPostDto extends OmitType(UpdatePostDto, ['author', 'customOrder']) {
    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    userOrder?: number = 0
}
