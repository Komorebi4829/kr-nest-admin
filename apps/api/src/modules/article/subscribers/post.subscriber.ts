import { EventSubscriber } from 'typeorm'

import { app } from '@/modules/core/helpers/app'
import { BaseSubscriber } from '@/modules/database/base'

import { PostEntity } from '../entities/post.entity'
import { SanitizeService } from '../services'

/**
 * 文章模型观察者
 *
 * @export
 * @class PostSubscriber
 * @extends {BaseSubscriber<PostEntity>}
 */
@EventSubscriber()
export class PostSubscriber extends BaseSubscriber<PostEntity> {
    protected entity = PostEntity

    /**
     * @description 加载文章数据的处理
     * @param {PostEntity} entity
     */
    async afterLoad(entity: PostEntity) {
        const sanitizeService = app.container.get(SanitizeService, { strict: false })
        entity.body = sanitizeService.sanitize(entity.body)
    }
}
