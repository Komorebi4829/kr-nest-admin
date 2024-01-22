import { BaseRepository } from '@/modules/database/base'
import { CustomRepository } from '@/modules/database/decorators'

import { PostEntity } from '../entities'

@CustomRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> {
    protected _qbName = 'post'

    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName)
            .leftJoinAndSelect(`${this.qbName}.categories`, 'categories')
            .leftJoinAndSelect(`${this.qbName}.cards`, 'cards')
            .leftJoinAndSelect(`${this.qbName}.author`, 'author')
            .leftJoinAndSelect(`${this.qbName}.thumb`, 'thumb')
            .leftJoinAndSelect(`${this.qbName}.background`, 'background')
    }
}
