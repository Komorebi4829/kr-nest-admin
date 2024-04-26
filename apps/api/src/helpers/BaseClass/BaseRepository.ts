import { isNil } from 'lodash'
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'

import { OrderType } from '../../modules/database/constants'
import { getOrderByQuery } from '../../modules/database/helpers'
import { OrderQueryType } from '../../modules/database/types'

export abstract class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
    protected abstract _qbName: string

    protected orderBy?: string | { name: string; order: `${OrderType}` }

    get qbName() {
        return this._qbName
    }

    buildBaseQB(): SelectQueryBuilder<E> {
        return this.createQueryBuilder(this.qbName)
    }

    addOrderByQuery(qb: SelectQueryBuilder<E>, orderBy?: OrderQueryType) {
        const orderByQuery = orderBy ?? this.orderBy
        return !isNil(orderByQuery) ? getOrderByQuery(qb, this.qbName, orderByQuery) : qb
    }
}
