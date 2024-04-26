import { Body, Controller, Delete, Patch, Post, SerializeOptions } from '@nestjs/common'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'

import { DeleteWithTrashDto, RestoreDto } from '@/helpers/dtos'

import { PermissionAction } from '../../constants'
import { Permission } from '../../decorators'
import { CreateRoleDto, UpdateRoleDto } from '../../dtos'
import { RoleEntity } from '../../entities'
import { RbacModule } from '../../rbac.module'
import { RoleService } from '../../services'
import { PermissionChecker } from '../../types'

const permission: PermissionChecker = async (ab) => ab.can(PermissionAction.MANAGE, RoleEntity.name)

@ApiTags('角色管理')
@ApiBearerAuth()
@Depends(RbacModule)
@Controller('roles')
export class RoleController {
    constructor(protected service: RoleService) {}

    @Post()
    @SerializeOptions({ groups: ['role-detail'] })
    @Permission(permission)
    async store(
        @Body()
        data: CreateRoleDto,
    ) {
        return this.service.create(data)
    }

    @Patch()
    @SerializeOptions({ groups: ['role-detail'] })
    @Permission(permission)
    async update(
        @Body()
        data: UpdateRoleDto,
    ) {
        return this.service.update(data)
    }

    @Delete()
    @SerializeOptions({ groups: ['role-list'] })
    @Permission(permission)
    async delete(
        @Body()
        data: DeleteWithTrashDto,
    ) {
        const { ids, trash } = data
        return this.service.delete(ids, trash)
    }

    @Patch('restore')
    @SerializeOptions({ groups: ['role-list'] })
    @Permission(permission)
    async restore(
        @Body()
        data: RestoreDto,
    ) {
        const { ids } = data
        return this.service.restore(ids)
    }
}
