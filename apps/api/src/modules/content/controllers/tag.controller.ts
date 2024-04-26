import { Controller, Get, Query, SerializeOptions, Param, ParseUUIDPipe } from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'

import { PaginateDto } from '@/helpers/dtos'

import { Guest } from '@/modules/user/decorators'

import { ContentModule } from '../content.module'
import { TagService } from '../services'

@ApiTags('标签信息')
@Depends(ContentModule)
@Controller('tags')
export class TagController {
    constructor(protected service: TagService) {}

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
