import { BaseRepository } from '@/modules/database/base'
import { OrderType } from '@/modules/database/constants'
import { CustomRepository } from '@/modules/database/decorators'

import { CardEntity } from '../entities'

@CustomRepository(CardEntity)
export class CardRepository extends BaseRepository<CardEntity> {
    protected _qbName = 'card'

    protected orderBy = { name: 'customOrder', order: OrderType.ASC }

    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName)
            .leftJoinAndSelect(`${this.qbName}.posts`, 'posts')
            .loadRelationCountAndMap(`${this.qbName}.postCount`, `${this.qbName}.posts`)
    }
}
