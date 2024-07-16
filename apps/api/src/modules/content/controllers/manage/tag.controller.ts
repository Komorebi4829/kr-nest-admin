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
import { OperationName } from '@/helpers/decorators/operationName.decorator'
import { DeleteWithTrashDto, PaginateDto } from '@/helpers/dtos'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { PermissionChecker } from '@/modules/rbac/types'

import { ContentModule } from '../../content.module'
import { CreateTagDto, UpdateTagDto } from '../../dtos'
import { TagEntity } from '../../entities'
import { TagService } from '../../services'

const permission: PermissionChecker = async (ab) => ab.can(PermissionAction.MANAGE, TagEntity.name)

@ApiTags('标签管理')
@ApiBearerAuth()
@Depends(ContentModule)
@Controller('tags')
export class TagController {
    constructor(protected service: TagService) {}

    @OperationName('Query Tag')
    @Get()
    @SerializeOptions({})
    @Permission(permission)
    async list(
        @Query()
        options: PaginateDto,
    ) {
        return this.service.paginate(options)
    }

    @OperationName('Query Tag')
    @Get(':id')
    @SerializeOptions({})
    @Permission(permission)
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }

    @OperationName('Create Tag')
    @Post()
    @SerializeOptions({})
    @Permission(permission)
    async store(
        @Body()
        data: CreateTagDto,
    ) {
        return this.service.create(data)
    }

    @OperationName('Update Tag')
    @Patch()
    @SerializeOptions({})
    @Permission(permission)
    async update(
        @Body()
        data: UpdateTagDto,
    ) {
        return this.service.update(data)
    }

    @OperationName('Delete Tag')
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
