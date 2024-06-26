import { Body, Controller, Delete, Get, Post, Query, SerializeOptions } from '@nestjs/common'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { In } from 'typeorm'

import { Depends } from '@/helpers/decorators'
import { DeleteDto } from '@/helpers/dtos'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { checkOwnerPermission } from '@/modules/rbac/helpers'
import { PermissionChecker } from '@/modules/rbac/types'

import { Guest, ReqUser } from '@/modules/user/decorators'

import { UserEntity } from '@/modules/user/entities'

import { ContentModule } from '../content.module'
import { CreateCommentDto, QueryCommentDto, QueryCommentTreeDto } from '../dtos'
import { CommentEntity } from '../entities'
import { CommentRepository } from '../repositories'
import { CommentService } from '../services'

const permissions: Record<'create' | 'owner', PermissionChecker> = {
    create: async (ab) => ab.can(PermissionAction.CREATE, CommentEntity.name),
    owner: async (ab, ref, request) =>
        checkOwnerPermission(ab, {
            request,
            getData: async (items) =>
                ref.get(CommentRepository, { strict: false }).find({
                    relations: ['user'],
                    where: { id: In(items) },
                }),
        }),
}

@ApiTags('评论操作')
@Depends(ContentModule)
@Controller('comments')
export class CommentController {
    constructor(protected service: CommentService) {}

    @Get('tree')
    @SerializeOptions({ groups: ['comment-tree'] })
    @Guest()
    async tree(
        @Query()
        query: QueryCommentTreeDto,
    ) {
        return this.service.findTrees(query)
    }

    @Get()
    @SerializeOptions({ groups: ['comment-list'] })
    @Guest()
    async list(
        @Query()
        query: QueryCommentDto,
    ) {
        return this.service.paginate(query)
    }

    @Post()
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['comment-detail'] })
    @Permission(permissions.create)
    async store(
        @Body()
        data: CreateCommentDto,
        @ReqUser() author: ClassToPlain<UserEntity>,
    ) {
        return this.service.create(data, author)
    }

    @Delete()
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['comment-list'] })
    @Permission(permissions.owner)
    async delete(
        @Body()
        data: DeleteDto,
    ) {
        const { ids } = data
        return this.service.delete(ids)
    }
}
