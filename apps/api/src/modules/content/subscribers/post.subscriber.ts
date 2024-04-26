import { isNil } from 'lodash'
import { EventSubscriber } from 'typeorm'

import { BaseSubscriber } from '@/helpers/BaseClass'

import { PostBodyType } from '../constants'
import { PostEntity } from '../entities'
import { SanitizeService } from '../services/sanitize.service'

@EventSubscriber()
export class PostSubscriber extends BaseSubscriber<PostEntity> {
    protected entity = PostEntity

    async afterLoad(entity: PostEntity) {
        const sanitizeService = (await this.configure.get('content.htmlEnabled'))
            ? this.container.get(SanitizeService)
            : undefined
        if (!isNil(sanitizeService) && entity.type === PostBodyType.HTML) {
            entity.body = sanitizeService.sanitize(entity.body)
        }
    }
}
