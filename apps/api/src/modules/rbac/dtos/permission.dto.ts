import { IsOptional, IsUUID } from 'class-validator'

import { DtoValidation } from '@/helpers/decorators'
import { PaginateDto } from '@/helpers/dtos'
import { IsDataExist } from '@/modules/database/constraints'

import { RoleEntity } from '../entities'

@DtoValidation({ type: 'query' })
export class QueryPermissionDto extends PaginateDto {
    @IsDataExist(RoleEntity, {
        groups: ['update'],
        message: '指定的角色不存在',
    })
    @IsUUID(undefined, { message: '角色ID格式错误' })
    @IsOptional()
    role?: string
}
