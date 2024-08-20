import { PartialType } from '@nestjs/swagger'

import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator'

import { DtoValidation } from '@/helpers/decorators'
import { PaginateDto } from '@/helpers/dtos'

@DtoValidation({ type: 'query' })
export class QueryDictDto extends PaginateDto {
    @IsOptional()
    code?: string

    @IsOptional()
    name?: string
}

@DtoValidation({ groups: ['create'] })
export class CreateDictDto {
    @MaxLength(50, {
        always: true,
        message: '字典编码长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '字典编码必须填写' })
    @IsOptional({ groups: ['update'] })
    code: string

    @MaxLength(100, {
        always: true,
        message: '字典名称长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '字典名称必须填写' })
    @IsOptional({ groups: ['update'] })
    name: string

    @MaxLength(500, {
        always: true,
        message: '备注长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    remark?: string

    @IsOptional({ groups: ['create', 'update'] })
    systemFlag?: boolean
}

@DtoValidation({ groups: ['update'] })
export class UpdateDictDto extends PartialType(CreateDictDto) {
    @IsUUID(undefined, { groups: ['update'], message: 'ID格式错误' })
    @IsDefined({ groups: ['update'], message: 'ID必须指定' })
    id: string
}
