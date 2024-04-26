import { IsEnum, IsOptional } from 'class-validator'

import { SelectTrashMode } from '@/modules/database/constants'

import { DtoValidation } from '../decorators'

import { PaginateDto } from './paginate.dto'

@DtoValidation({ type: 'query' })
export class PaginateWithTrashedDto extends PaginateDto {
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode
}
