import { Controller, Get, Param, ParseUUIDPipe, Query, SerializeOptions } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'

import { PaginateWithTrashedDto } from '@/helpers/dtos'

import { PermissionAction } from '../../constants'
import { Permission } from '../../decorators'
import { PermissionEntity } from '../../entities'
import { RbacModule } from '../../rbac.module'
import { PermissionService } from '../../services'
import { PermissionChecker } from '../../types'

const permission: PermissionChecker = async (ab) =>
    ab.can(PermissionAction.MANAGE, PermissionEntity.name)

@ApiTags('权限信息')
@ApiBearerAuth()
@Depends(RbacModule)
@Controller('permissions')
export class PermissionController {
    constructor(protected service: PermissionService) {}

    @Get()
    @SerializeOptions({ groups: ['permssion-list'] })
    @Permission(permission)
    async list(
        @Query()
        options: PaginateWithTrashedDto,
    ) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @SerializeOptions({ groups: ['permssion-detail'] })
    @Permission(permission)
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }
}
