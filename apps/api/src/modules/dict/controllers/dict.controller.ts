import { Controller, Get, Query, SerializeOptions, Param, ParseUUIDPipe } from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'

import { PaginateDto } from '@/helpers/dtos'

import { Guest } from '@/modules/user/decorators'

import { DictModule } from '../dict.module'
import { DictService } from '../services'

@ApiTags('字典信息')
@Depends(DictModule)
@Controller('dicts')
export class DictController {
    constructor(protected service: DictService) {}

    @Get()
    @SerializeOptions({})
    @Guest()
    async list(
        @Query()
        options: PaginateDto,
    ) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @SerializeOptions({})
    @Guest()
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }
}
