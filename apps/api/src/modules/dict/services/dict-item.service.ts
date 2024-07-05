import { Injectable } from '@nestjs/common'

import { isNil, omit } from 'lodash'

import { SelectQueryBuilder } from 'typeorm'

import { BaseService } from '@/helpers/BaseClass'

import { SelectTrashMode } from '@/modules/database/constants'
import { paginate } from '@/modules/database/helpers'

import { QueryHook } from '@/modules/database/types'

import { CreateDictItemDto, QueryDictItemDto, UpdateDictItemDto } from '../dtos'
import { DictItemEntity } from '../entities'
import { DictItemRepository, DictRepository } from '../repositories'

type FindParams = {
    [key in keyof Omit<QueryDictItemDto, 'limit' | 'page'>]: QueryDictItemDto[key]
}

@Injectable()
export class DictItemService extends BaseService<DictItemEntity, DictItemRepository> {
    constructor(
        protected repository: DictItemRepository,
        protected dictRepository: DictRepository,
    ) {
        super(repository)
    }

    async paginate(options: QueryDictItemDto, callback?: QueryHook<DictItemEntity>) {
        const qb = await this.buildListQuery(this.repository.buildBaseQB(), options, callback)
        return paginate(qb, options)
    }

    async create(data: CreateDictItemDto) {
        const createDictItemDto = {
            ...data,
            dict: !isNil(data.dict) ? await this.getDict(data.dict) : null,
        }
        const item = await this.repository.save(createDictItemDto)
        return this.detail(item.id)
    }

    protected async getDict(id: string) {
        return !isNil(id) ? this.dictRepository.findOneOrFail({ where: { id } }) : null
    }

    async update(data: UpdateDictItemDto) {
        await this.repository.update(data.id, omit(data, ['id', 'dict']))
        return this.detail(data.id)
    }

    protected async buildListQuery(
        qb: SelectQueryBuilder<DictItemEntity>,
        options: FindParams,
        callback?: QueryHook<DictItemEntity>,
    ) {
        const { dict, trashed = SelectTrashMode.NONE } = options

        if (trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY) {
            qb.withDeleted()
            if (trashed === SelectTrashMode.ONLY) qb.where(`post.deletedAt is not null`)
        }

        if (dict) await this.queryByDict(dict, qb)
        if (callback) return callback(qb)
        return qb
    }

    protected async queryByDict(id: string, qb: SelectQueryBuilder<DictItemEntity>) {
        return qb.andWhere(`${this.repository.qbName}.dictId = :id`, { id })
    }
}
