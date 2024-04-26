import { Transform } from 'class-transformer'

import { IsBoolean, IsDefined, IsOptional, IsUUID } from 'class-validator'

import { toBoolean } from '@/utils/common'

import { DtoValidation } from '../decorators'

import { DeleteDto } from './delete.dto'

@DtoValidation()
export class DeleteWithTrashDto extends DeleteDto {
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean
}

@DtoValidation()
export class RestoreDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    ids: string[]
}
