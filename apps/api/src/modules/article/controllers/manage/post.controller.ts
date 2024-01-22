import { Body, Controller, Post } from '@nestjs/common'

import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { isNil } from 'lodash'

import { ClassToPlain } from '@/modules/core/types'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators/permission.decorator'

import { simpleCurdOption } from '@/modules/rbac/helpers'
import { PermissionChecker } from '@/modules/rbac/types'

import { BaseController } from '@/modules/restful/base.controller'
import { Crud, Depends } from '@/modules/restful/decorators'
import { ReqUser } from '@/modules/user/decorators'
import { UserEntity } from '@/modules/user/entities'

import { ArticleModule } from '../../article.module'
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../../dtos'

import { PostEntity } from '../../entities'
import { PostService } from '../../services'

const permissions: PermissionChecker[] = [async (ab) => ab.can(PermissionAction.MANAGE, 'all')]
/**
 * 文章控制器
 */
@ApiTags('文章管理')
@ApiBearerAuth()
@Depends(ArticleModule)
@Crud({
    id: 'post',
    enabled: [
        { name: 'list', option: simpleCurdOption(permissions, '文章查询,以分页模式展示') },
        { name: 'detail', option: simpleCurdOption(permissions, '文章详情') },
        { name: 'update', option: simpleCurdOption(permissions, '修改文章') },
        { name: 'delete', option: simpleCurdOption(permissions, '删除文章,支持批量删除') },
    ],
    dtos: {
        list: QueryPostDto,
        update: UpdatePostDto,
    },
})
@Controller('posts')
export class PostManageController extends BaseController<PostService> {
    constructor(protected postService: PostService) {
        super(postService)
    }

    @Post()
    @ApiOperation({ summary: '新增一篇文章' })
    @Permission(async (ab) => ab.can(PermissionAction.MANAGE, 'all'))
    async store(
        @Body() data: CreatePostDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<PostEntity> {
        const author = isNil(data.author) ? user : ({ id: data.author } as ClassToPlain<UserEntity>)
        return this.service.create({ ...data, author: author.id })
    }

    @Post('thumb')
    @ApiOperation({ summary: '上传文章封面图' })
    @ApiConsumes('multipart/form-data')
    async uploadThumb(@Body() data: any, @ReqUser() user: ClassToPlain<UserEntity>) {
        return 'media ok'
    }

    @Post('bg')
    @ApiOperation({ summary: '上传文章背景图' })
    @ApiConsumes('multipart/form-data')
    async uploadBackground(@Body() data: any, @ReqUser() user: ClassToPlain<UserEntity>) {
        return 'media ok'
    }
}
