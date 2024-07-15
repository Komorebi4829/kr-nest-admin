import { Injectable } from '@nestjs/common'

import { BaseService } from '@/helpers/BaseClass'

import { OperationLogEntity } from '../entities'
import { OperationLogRepository } from '../repositories'

@Injectable()
export class OperationLogService extends BaseService<OperationLogEntity, OperationLogRepository> {
    constructor(protected repository: OperationLogRepository) {
        super(repository)
    }
}
