import { BaseRepository } from '@/helpers/BaseClass'
import { CustomRepository } from '@/modules/database/decorators'

import { PermissionEntity } from '../entities'

@CustomRepository(PermissionEntity)
export class PermissionRepository extends BaseRepository<PermissionEntity> {
    protected _qbName = 'permission'

    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName).leftJoinAndSelect(
            `${this.qbName}.roles`,
            'roles',
        )
    }
}
