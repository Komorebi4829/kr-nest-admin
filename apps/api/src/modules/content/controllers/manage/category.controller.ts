import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
} from '@nestjs/common'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'
import { DeleteWithTrashDto, PaginateDto } from '@/helpers/dtos'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { PermissionChecker } from '@/modules/rbac/types'

import { ContentModule } from '../../content.module'
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos'
import { CategoryEntity } from '../../entities'
import { CategoryService } from '../../services'

const permission: PermissionChecker = async (ab) =>
    ab.can(PermissionAction.MANAGE, CategoryEntity.name)

@ApiTags('分类管理')
@ApiBearerAuth()
@Depends(ContentModule)
@Controller('categories')
export class CategoryController {
    constructor(protected service: CategoryService) {}

    @Get()
    @Permission(permission)
    @SerializeOptions({ groups: ['category-list'] })
    async list(@Query() options: PaginateDto) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @Permission(permission)
    @SerializeOptions({ groups: ['category-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }

    @Post()
    @Permission(permission)
    @SerializeOptions({ groups: ['category-detail'] })
    async store(@Body() data: CreateCategoryDto) {
        return this.service.create(data)
    }

    @Patch()
    @Permission(permission)
    @SerializeOptions({ groups: ['category-detail'] })
    async update(
        @Body()
        data: UpdateCategoryDto,
    ) {
        return this.service.update(data)
    }

    @Delete()
    @Permission(permission)
    @SerializeOptions({ groups: ['category-list'] })
    async delete(
        @Body()
        data: DeleteWithTrashDto,
    ) {
        const { ids, trash } = data
        return this.service.delete(ids, trash)
    }
}
