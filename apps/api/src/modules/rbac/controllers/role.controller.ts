import { Controller, Get, Param, ParseUUIDPipe, Query, SerializeOptions } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'

import { PaginateWithTrashedDto } from '@/helpers/dtos'
import { Guest } from '@/modules/user/decorators'

import { RbacModule } from '../rbac.module'
import { RoleService } from '../services'

@ApiTags('角色查询')
@Depends(RbacModule)
@Controller('roles')
export class RoleController {
    constructor(protected service: RoleService) {}

    @Get()
    @SerializeOptions({ groups: ['role-list'] })
    @Guest()
    async list(
        @Query()
        options: PaginateWithTrashedDto,
    ) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @SerializeOptions({ groups: ['role-detail'] })
    @Guest()
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }
}
