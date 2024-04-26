import { Injectable } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'

import { toBoolean } from '@/utils/common'

@Injectable()
export class DetailQueryDto {
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    trashed?: boolean
}
