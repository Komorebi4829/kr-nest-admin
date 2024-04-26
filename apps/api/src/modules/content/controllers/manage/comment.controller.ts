import { Body, Controller, Delete, Get, Query, SerializeOptions } from '@nestjs/common'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'
import { DeleteDto } from '@/helpers/dtos'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { PermissionChecker } from '@/modules/rbac/types'

import { ContentModule } from '../../content.module'
import { QueryCommentDto } from '../../dtos'
import { CommentEntity } from '../../entities'
import { CommentService } from '../../services'

const permission: PermissionChecker = async (ab) =>
    ab.can(PermissionAction.MANAGE, CommentEntity.name)

@ApiTags('评论管理')
@ApiBearerAuth()
@Depends(ContentModule)
@Controller('comments')
export class CommentController {
    constructor(protected service: CommentService) {}

    @Get()
    @SerializeOptions({ groups: ['comment-list'] })
    @Permission(permission)
    async list(
        @Query()
        query: QueryCommentDto,
    ) {
        return this.service.paginate(query)
    }

    @Delete()
    @SerializeOptions({ groups: ['comment-list'] })
    @Permission(permission)
    async delete(
        @Body()
        data: DeleteDto,
    ) {
        const { ids } = data
        return this.service.delete(ids)
    }
}
