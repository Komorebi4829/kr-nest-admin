import { Controller, Get, SerializeOptions, Param, ParseUUIDPipe } from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'

import { Guest } from '@/modules/user/decorators'

import { DictModule } from '../dict.module'
import { DictItemService } from '../services'

@ApiTags('字典项信息')
@Depends(DictModule)
@Controller('dict-items')
export class DictItemController {
    constructor(protected service: DictItemService) {}

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
