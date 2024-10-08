import { BaseRepository } from '@/helpers/BaseClass'
import { CustomRepository } from '@/modules/database/decorators'

import { PostEntity, TagEntity } from '../entities'

@CustomRepository(TagEntity)
export class TagRepository extends BaseRepository<TagEntity> {
    protected _qbName = 'tag'

    buildBaseQB() {
        return this.createQueryBuilder('tag')
            .leftJoinAndSelect('tag.posts', 'posts')
            .addSelect(
                (subQuery) => subQuery.select('COUNT(p.id)', 'count').from(PostEntity, 'p'),
                'postcount',
            )
            .orderBy('postcount', 'DESC')
            .loadRelationCountAndMap('tag.postCount', 'tag.posts')
    }
}
