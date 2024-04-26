import { Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import { SelectQueryBuilder } from 'typeorm'

import { BaseService } from '@/helpers/BaseClass'

import { QueryHook } from '@/modules/database/types'

import { QueryPermissionDto } from '../dtos'
import { PermissionEntity } from '../entities'
import { PermissionRepository } from '../repositories'

type FindParams = {
    [key in keyof Omit<QueryPermissionDto, 'limit' | 'page'>]: QueryPermissionDto[key]
}

@Injectable()
export class PermissionService extends BaseService<PermissionEntity, PermissionRepository> {
    constructor(protected permissionRepository: PermissionRepository) {
        super(permissionRepository)
    }

    protected async buildListQuery(
        queryBuilder: SelectQueryBuilder<PermissionEntity>,
        options: FindParams,
        callback?: QueryHook<PermissionEntity>,
    ) {
        const qb = await super.buildListQB(queryBuilder, options, callback)
        if (!isNil(options.role)) {
            qb.andWhere('roles.id IN (:...roles)', {
                roles: [options.role],
            })
        }
    }
}
