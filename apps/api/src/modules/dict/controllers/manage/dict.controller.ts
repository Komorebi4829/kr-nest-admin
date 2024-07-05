import {
    Controller,
    SerializeOptions,
    Patch,
    Delete,
    Post,
    Body,
    Get,
    ParseUUIDPipe,
    Query,
    Param,
} from '@nestjs/common'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'
import { DeleteWithTrashDto } from '@/helpers/dtos'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { PermissionChecker } from '@/modules/rbac/types'

import { DictModule } from '../../dict.module'
import { CreateDictDto, QueryDictDto, UpdateDictDto } from '../../dtos'
import { DictEntity } from '../../entities'
import { DictService } from '../../services'

const permission: PermissionChecker = async (ab) => ab.can(PermissionAction.MANAGE, DictEntity.name)

@ApiTags('字典管理')
@ApiBearerAuth()
@Depends(DictModule)
@Controller('dicts')
export class DictController {
    constructor(protected service: DictService) {}

    @Get()
    @SerializeOptions({})
    @Permission(permission)
    async list(
        @Query()
        options: QueryDictDto,
    ) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @SerializeOptions({})
    @Permission(permission)
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }

    @Post()
    @SerializeOptions({})
    @Permission(permission)
    async store(
        @Body()
        data: CreateDictDto,
    ) {
        return this.service.create(data)
    }

    @Patch()
    @SerializeOptions({})
    @Permission(permission)
    async update(
        @Body()
        data: UpdateDictDto,
    ) {
        return this.service.update(data)
    }

    @Delete()
    @SerializeOptions({})
    @Permission(permission)
    async delete(
        @Body()
        data: DeleteWithTrashDto,
    ) {
        const { ids, trash } = data
        return this.service.delete(ids, trash)
    }
}
