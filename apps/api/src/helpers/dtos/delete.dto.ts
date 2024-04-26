import { Injectable } from '@nestjs/common'
import { IsDefined, IsUUID } from 'class-validator'

import { DtoValidation } from '../decorators'

@Injectable()
@DtoValidation()
export class DeleteDto {
    // @ApiProperty({
    //     description: '待删除的ID列表',
    //     type: 'array',
    //     items: { type: 'string' },
    //     required: true,
    // })
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    ids: string[] = []
}
