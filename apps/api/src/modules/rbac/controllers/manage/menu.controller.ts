import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
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

import { CreateMenuDto, UpdateMenuDto } from '../../dtos'
import { MenuEntity } from '../../entities'
import { RbacModule } from '../../rbac.module'
import { MenuService } from '../../services'

const permission: PermissionChecker = async (ab) => ab.can(PermissionAction.MANAGE, MenuEntity.name)

@ApiTags('菜单管理')
@ApiBearerAuth()
@Depends(RbacModule)
@Controller('menus')
export class MenuController {
    constructor(protected service: MenuService) {}

    @Get()
    @Permission(permission)
    @SerializeOptions({ groups: ['menu-list'] })
    async list(@Query() options: PaginateDto) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @Permission(permission)
    @SerializeOptions({ groups: ['menu-detail'] })
    async detail(
        @Param('id')
        id: string,
    ) {
        return this.service.detail(id)
    }

    @Post()
    @Permission(permission)
    @SerializeOptions({ groups: ['menu-detail'] })
    async store(@Body() data: CreateMenuDto) {
        return this.service.create(data)
    }

    @Patch()
    @Permission(permission)
    @SerializeOptions({ groups: ['menu-detail'] })
    async update(
        @Body()
        data: UpdateMenuDto,
    ) {
        return this.service.update(data)
    }

    @Delete()
    @Permission(permission)
    @SerializeOptions({ groups: ['menu-list'] })
    async delete(
        @Body()
        data: DeleteWithTrashDto,
    ) {
        const { ids, trash } = data
        return this.service.delete(ids, trash)
    }
}
