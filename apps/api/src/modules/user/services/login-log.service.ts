import { Injectable } from '@nestjs/common'

import { BaseService } from '@/helpers/BaseClass'

import { LoginLogEntity } from '../entities'
import { LoginLogRepository } from '../repositories'

@Injectable()
export class LoginLogService extends BaseService<LoginLogEntity, LoginLogRepository> {
    constructor(protected repository: LoginLogRepository) {
        super(repository)
    }

    async create(data: any) {
        const item = await this.repository.save(data)
        return this.detail(item.id)
    }
}
