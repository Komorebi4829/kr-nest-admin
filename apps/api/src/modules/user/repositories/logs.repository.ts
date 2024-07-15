import { BaseRepository } from '@/helpers/BaseClass'
import { CustomRepository } from '@/modules/database/decorators'

import { LoginLogEntity, OperationLogEntity } from '../entities'

@CustomRepository(LoginLogEntity)
export class LoginLogRepository extends BaseRepository<LoginLogEntity> {
    protected _qbName = 'login_logs'

    buildBaseQB() {
        return this.createQueryBuilder(this.qbName)
            .orderBy(`${this.qbName}.login_time`, 'DESC')
            .leftJoinAndSelect(`${this.qbName}.user`, 'user')
    }
}

@CustomRepository(OperationLogEntity)
export class OperationLogRepository extends BaseRepository<OperationLogEntity> {
    protected _qbName = 'operation_logs'

    buildBaseQB() {
        return this.createQueryBuilder(this.qbName)
            .orderBy(`${this.qbName}.operation_time`, 'DESC')
            .leftJoinAndSelect(`${this.qbName}.user`, 'user')
    }
}
