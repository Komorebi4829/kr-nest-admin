import { BaseRepository } from '@/helpers/BaseClass'
import { CustomRepository } from '@/modules/database/decorators'

import { DictEntity } from '../entities'

@CustomRepository(DictEntity)
export class DictRepository extends BaseRepository<DictEntity> {
    protected _qbName = 'dict'

    buildBaseQB() {
        return this.createQueryBuilder('dict')
    }
}
