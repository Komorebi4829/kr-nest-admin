import { PickType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength, ValidateIf } from 'class-validator'

import { DtoValidation } from '@/helpers/decorators'
import { PaginateDto } from '@/helpers/dtos'
import { IsDataExist } from '@/modules/database/constraints'

import { UserEntity } from '@/modules/user/entities'

import { PostEntity } from '../entities'

@DtoValidation({ type: 'query' })
export class QueryCommentDto extends PaginateDto {
    @IsDataExist(UserEntity, {
        message: '所属的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    author?: string

    @IsDataExist(PostEntity, {
        message: '文章不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsOptional()
    post?: string
}

@DtoValidation({ type: 'query' })
export class QueryCommentTreeDto extends PickType(QueryCommentDto, ['post']) {}

@DtoValidation()
export class CreateCommentDto {
    @MaxLength(1000, { message: '评论内容不能超过$constraint1个字' })
    @IsNotEmpty({ message: '评论内容不能为空' })
    body: string

    @IsDataExist(PostEntity, {
        message: '文章不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsDefined({ message: 'ID必须指定' })
    post: string

    @IsUUID(undefined, { always: true, message: 'ID格式错误' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string
}
