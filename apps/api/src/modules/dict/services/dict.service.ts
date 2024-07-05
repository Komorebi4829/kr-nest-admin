import { Injectable } from '@nestjs/common'

import { omit } from 'lodash'

import { SelectQueryBuilder } from 'typeorm'

import { BaseService } from '@/helpers/BaseClass'

import { paginate } from '@/modules/database/helpers'

import { QueryHook } from '@/modules/database/types'

import { CreateDictDto, QueryDictDto, UpdateDictDto } from '../dtos'
import { DictEntity } from '../entities'
import { DictRepository } from '../repositories'

type FindParams = {
    [key in keyof Omit<QueryDictDto, 'limit' | 'page'>]: QueryDictDto[key]
}

@Injectable()
export class DictService extends BaseService<DictEntity, DictRepository> {
    constructor(protected repository: DictRepository) {
        super(repository)
    }

    async paginate(options: QueryDictDto, callback?: QueryHook<DictEntity>) {
        const qb = await this.buildListQuery(this.repository.buildBaseQB(), options, callback)
        return paginate(qb, options)
    }

    async create(data: CreateDictDto) {
        const item = await this.repository.save(data)
        return this.detail(item.id)
    }

    async update(data: UpdateDictDto) {
        await this.repository.update(data.id, omit(data, ['id']))
        return this.detail(data.id)
    }

    protected async buildListQuery(
        qb: SelectQueryBuilder<DictEntity>,
        options: FindParams,
        callback?: QueryHook<DictEntity>,
    ) {
        const { code, name } = options
        const { qbName } = this.repository

        if (code) {
            qb.andWhere(`${qbName}.code like :codeLike`, { codeLike: `%${code}%` })
        }
        if (name) {
            qb.andWhere(`${qbName}.name like :nameLike`, { nameLike: `%${name}%` })
        }
        if (callback) return callback(qb)
        return qb
    }
}
