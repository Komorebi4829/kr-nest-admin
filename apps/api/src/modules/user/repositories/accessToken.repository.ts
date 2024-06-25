import { BaseRepository } from '@/helpers/BaseClass'
import { CustomRepository } from '@/modules/database/decorators'

import { AccessTokenEntity } from '../entities'

@CustomRepository(AccessTokenEntity)
export class AccessTokenRepository extends BaseRepository<AccessTokenEntity> {
    protected _qbName = 'user_access_token'

    buildBaseQB() {
        return this.createQueryBuilder(this.qbName)
            .orderBy(`${this.qbName}.createdAt`, 'DESC')
            .leftJoinAndSelect(`${this.qbName}.refreshToken`, 'refreshToken')
    }
}
