import { Controller, Get, Param, ParseUUIDPipe, Query, SerializeOptions } from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'

import { PaginateDto } from '@/helpers/dtos'
import { Guest } from '@/modules/user/decorators'

import { ContentModule } from '../content.module'
import { CategoryService } from '../services'

@ApiTags('分类信息')
@Depends(ContentModule)
@Controller('categories')
export class CategoryController {
    constructor(protected service: CategoryService) {}

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    @Guest()
    async tree() {
        return this.service.findTrees({})
    }

    @Get()
    @SerializeOptions({ groups: ['category-list'] })
    @Guest()
    async list(@Query() options: PaginateDto) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @SerializeOptions({ groups: ['category-detail'] })
    @Guest()
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }
}
