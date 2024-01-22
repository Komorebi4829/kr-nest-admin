import { Controller, Get, Param, ParseUUIDPipe, Query, SerializeOptions } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { omit } from 'lodash'

import { IsNull, Not } from 'typeorm'

import { ClassToPlain } from '@/modules/core/types'

import { Depends } from '@/modules/restful/decorators'
import { Guest, ReqUser } from '@/modules/user/decorators'

import { UserEntity } from '@/modules/user/entities'

import { DetailQueryDto } from '../../restful/dtos/detail-query.dto'
import { ArticleModule } from '../article.module'
import { QueryPostDto } from '../dtos'
import { PostService } from '../services/post.service'

/**
 * 文章控制器
 */
@ApiTags('文章查询')
@Depends(ArticleModule)
@Controller('posts')
export class PostController {
    constructor(protected postService: PostService) {}

    @Get()
    @ApiOperation({ summary: '查询文章列表,分页展示' })
    @Guest()
    @SerializeOptions({ groups: ['post-list'] })
    async list(@Query() options: QueryPostDto, @ReqUser() author: ClassToPlain<UserEntity>) {
        const lang = 'zh'
        return this.postService.paginate(omit(options, ['author', 'isPublished']), async (qb) =>
            qb.where({
                publishedAt: Not(IsNull()),
                ...(lang === 'zh' && { title: Not(IsNull()) }),
                // ...(lang === 'en' && { title_en: Not(IsNull()) }),
            }),
        )
    }

    @Get(':item')
    @Guest()
    @ApiOperation({ summary: '查询文章详情' })
    @SerializeOptions({ groups: ['post-detail'] })
    async detail(
        @Query() { trashed }: DetailQueryDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
        @ReqUser() author: ClassToPlain<UserEntity>,
    ) {
        return this.postService.detail(item, async (qb) =>
            qb.andWhere({ publishedAt: Not(IsNull()) }),
        )
    }
}
