import { PartialType } from '@nestjs/swagger'

import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator'

import { DtoValidation } from '@/helpers/decorators'

@DtoValidation({ groups: ['create'] })
export class CreateTagDto {
    @MaxLength(255, {
        always: true,
        message: '标签名称长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '标签名称必须填写' })
    @IsOptional({ groups: ['update'] })
    name: string

    @MaxLength(500, {
        always: true,
        message: '标签描述长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    description?: string
}

@DtoValidation({ groups: ['update'] })
export class UpdateTagDto extends PartialType(CreateTagDto) {
    @IsUUID(undefined, { groups: ['update'], message: 'ID格式错误' })
    @IsDefined({ groups: ['update'], message: 'ID必须指定' })
    id: string
}
