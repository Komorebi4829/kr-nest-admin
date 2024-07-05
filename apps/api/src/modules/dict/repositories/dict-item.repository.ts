import { BaseRepository } from '@/helpers/BaseClass'
import { CustomRepository } from '@/modules/database/decorators'

import { DictItemEntity } from '../entities'

@CustomRepository(DictItemEntity)
export class DictItemRepository extends BaseRepository<DictItemEntity> {
    protected _qbName = 'dict-item'

    buildBaseQB() {
        return this.createQueryBuilder(this.qbName)
            .leftJoinAndSelect(`${this.qbName}.dict`, 'dict')
            .orderBy(`${this.qbName}.sortOrder`, 'ASC')
    }
}
