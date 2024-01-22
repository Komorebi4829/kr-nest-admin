import { Optional } from '@nestjs/common'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { isNil } from 'lodash'
import {
    EntitySubscriberInterface,
    EventSubscriber,
    ObjectLiteral,
    ObjectType,
    UpdateEvent,
    InsertEvent,
    SoftRemoveEvent,
    RemoveEvent,
    RecoverEvent,
    TransactionStartEvent,
    TransactionCommitEvent,
    TransactionRollbackEvent,
    EntityTarget,
    DataSource,
} from 'typeorm'

import { Configure } from '@/modules/config/configure'
import { app } from '@/modules/core/helpers'

import { getCustomRepository } from '../helpers'

import { RepositoryType } from '../types'

type SubscriberEvent<E extends ObjectLiteral> =
    | InsertEvent<E>
    | UpdateEvent<E>
    | SoftRemoveEvent<E>
    | RemoveEvent<E>
    | RecoverEvent<E>
    | TransactionStartEvent
    | TransactionCommitEvent
    | TransactionRollbackEvent

@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
    implements EntitySubscriberInterface<E>
{
    protected abstract entity: ObjectType<E>

    constructor(
        @Optional() protected dataSource?: DataSource,
        @Optional() protected _configure?: Configure,
    ) {
        if (!isNil(this.dataSource)) this.dataSource.subscribers.push(this)
    }

    get configure(): Configure {
        return !isNil(this._configure)
            ? this._configure
            : app.container.get(Configure, { strict: false })
    }

    get container(): NestFastifyApplication {
        return app.container
    }

    protected getDataSource(event: SubscriberEvent<E>) {
        return this.dataSource ?? event.connection
    }

    protected getManage(event: SubscriberEvent<E>) {
        return this.dataSource ? this.dataSource.manager : event.manager
    }

    listenTo() {
        return this.entity
    }

    async afterLoad(entity: any) {
        // 是否启用树形
        if ('parent' in entity && isNil(entity.depth)) entity.depth = 0
    }

    protected getRepositoy<
        C extends ClassType<T>,
        T extends RepositoryType<E>,
        A extends EntityTarget<ObjectLiteral>,
    >(event: SubscriberEvent<E>, repository?: C, entity?: A) {
        return isNil(repository)
            ? this.getDataSource(event).getRepository(entity ?? this.entity)
            : getCustomRepository<T, E>(this.getDataSource(event), repository)
    }

    protected isUpdated(cloumn: keyof E, event: UpdateEvent<E>) {
        return !!event.updatedColumns.find((item) => item.propertyName === cloumn)
    }
}
