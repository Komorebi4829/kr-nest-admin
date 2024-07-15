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

import { isNil } from 'lodash'

import { Depends } from '@/helpers/decorators'
import { OperationName } from '@/helpers/decorators/operationName.decorator'
import { DeleteWithTrashDto, RestoreDto } from '@/helpers/dtos'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { PermissionChecker } from '@/modules/rbac/types'

import { ReqUser } from '@/modules/user/decorators'

import { UserEntity } from '@/modules/user/entities'

import { ContentModule } from '../../content.module'
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../../dtos'
import { PostEntity } from '../../entities'
import { PostService } from '../../services/post.service'

const permission: PermissionChecker = async (ab) => ab.can(PermissionAction.MANAGE, PostEntity.name)

@ApiTags('文章管理')
@ApiBearerAuth()
@Depends(ContentModule)
@Controller('posts')
export class PostController {
    constructor(protected service: PostService) {}

    @OperationName('Query Post')
    @Get()
    @SerializeOptions({ groups: ['post-list'] })
    @Permission(permission)
    async manageList(
        @Query()
        options: QueryPostDto,
    ) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @SerializeOptions({ groups: ['post-detail'] })
    @Permission(permission)
    async manageDetail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }

    @Post()
    @SerializeOptions({ groups: ['post-detail'] })
    @Permission(permission)
    async storeManage(
        @Body()
        { author, ...data }: CreatePostDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.service.create(data, {
            id: isNil(author) ? user.id : author,
        } as ClassToPlain<UserEntity>)
    }

    @Patch()
    @SerializeOptions({ groups: ['post-detail'] })
    @Permission(permission)
    async manageUpdate(
        @Body()
        data: UpdatePostDto,
    ) {
        return this.service.update(data)
    }

    @Delete()
    @SerializeOptions({ groups: ['post-list'] })
    @Permission(permission)
    async manageDelete(
        @Body()
        data: DeleteWithTrashDto,
    ) {
        const { ids, trash } = data
        return this.service.delete(ids, trash)
    }

    @Patch('restore')
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['post-list'] })
    @Permission(permission)
    async manageRestore(
        @Body()
        data: RestoreDto,
    ) {
        const { ids } = data
        return this.service.restore(ids)
    }
}
