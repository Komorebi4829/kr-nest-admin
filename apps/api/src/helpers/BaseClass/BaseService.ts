import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { isNil } from 'lodash'
import { In, ObjectLiteral, SelectQueryBuilder } from 'typeorm'

import { SelectTrashMode, TreeChildrenResolve } from '../../modules/database/constants'
import { paginate, treePaginate } from '../../modules/database/helpers'
import {
    PaginateOptions,
    PaginateReturn,
    QueryHook,
    ServiceListQueryOption,
} from '../../modules/database/types'

import { BaseRepository } from './BaseRepository'
import { BaseTreeRepository } from './BaseTreeRepository'

export abstract class BaseService<
    E extends ObjectLiteral,
    R extends BaseRepository<E> | BaseTreeRepository<E>,
    P extends ServiceListQueryOption<E> = ServiceListQueryOption<E>,
> {
    protected repository: R

    protected enableTrash = true

    constructor(repository: R) {
        this.repository = repository
        if (
            !(
                this.repository instanceof BaseRepository ||
                this.repository instanceof BaseTreeRepository
            )
        ) {
            throw new Error(
                'Repository must instance of BaseRepository or BaseTreeRepository in DataService!',
            )
        }
    }

    async list(options?: P, callback?: QueryHook<E>): Promise<E[]> {
        const { trashed: isTrashed = false } = options ?? {}
        const trashed = isTrashed || SelectTrashMode.NONE
        if (this.repository instanceof BaseTreeRepository) {
            const withTrashed =
                this.enableTrash &&
                (trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY)
            const onlyTrashed = this.enableTrash && trashed === SelectTrashMode.ONLY
            const tree = await this.repository.findTrees({
                ...options,
                withTrashed,
                onlyTrashed,
            })
            return this.repository.toFlatTrees(tree)
        }
        const qb = await this.buildListQB(this.repository.buildBaseQB(), options, callback)
        return qb.getMany()
    }

    async paginate(
        options?: PaginateOptions & P,
        callback?: QueryHook<E>,
    ): Promise<PaginateReturn<E>> {
        const queryOptions = (options ?? {}) as P
        if (this.repository instanceof BaseTreeRepository) {
            const data = await this.list(queryOptions, callback)
            return treePaginate(options, data) as PaginateReturn<E>
        }
        const qb = await this.buildListQB(this.repository.buildBaseQB(), queryOptions, callback)
        return paginate(qb, options)
    }

    async detail(id: string, callback?: QueryHook<E>): Promise<E> {
        const qb = await this.buildItemQB(id, this.repository.buildBaseQB(), callback)
        const item = await qb.getOne()
        if (!item) throw new NotFoundException(`${this.repository.qbName} ${id} not exists!`)
        return item
    }

    create(data: any, ...others: any[]): Promise<E> {
        throw new ForbiddenException(`Can not to create ${this.repository.qbName}!`)
    }

    update(data: any, ...others: any[]): Promise<E> {
        throw new ForbiddenException(`Can not to update ${this.repository.qbName}!`)
    }

    async delete(ids: string[], trash?: boolean) {
        let items: E[] = []
        if (this.repository instanceof BaseTreeRepository) {
            items = await this.repository.find({
                where: { id: In(ids) as any },
                withDeleted: this.enableTrash ? true : undefined,
                relations: ['parent', 'children'],
            })
            if (this.repository.childrenResolve === TreeChildrenResolve.UP) {
                for (const item of items) {
                    if (isNil(item.children) || item.children.length <= 0) continue
                    const nchildren = [...item.children].map((c) => {
                        c.parent = item.parent
                        return item
                    })
                    await this.repository.save(nchildren)
                }
            }
        } else {
            items = await this.repository.find({
                where: { id: In(ids) as any },
                withDeleted: this.enableTrash ? true : undefined,
            })
        }
        if (this.enableTrash && trash) {
            const directs = items.filter((item) => !isNil(item.deletedAt))
            const softs = items.filter((item) => isNil(item.deletedAt))
            return [
                ...(await this.repository.remove(directs)),
                ...(await this.repository.softRemove(softs)),
            ]
        }
        return this.repository.remove(items)
    }

    async restore(ids: string[]) {
        if (!this.enableTrash) {
            throw new ForbiddenException(
                `Can not to retore ${this.repository.qbName},because trash not enabled!`,
            )
        }
        const items = await this.repository.find({
            where: { id: In(ids) as any },
            withDeleted: true,
        })
        const trasheds = items.filter((item) => !isNil(item))
        if (trasheds.length < 0) return []
        await this.repository.restore(trasheds.map((item) => item.id))
        const qb = await this.buildListQB(
            this.repository.buildBaseQB(),
            undefined,
            async (builder) => builder.andWhereInIds(trasheds),
        )
        return qb.getMany()
    }

    protected async buildItemQB(id: string, qb: SelectQueryBuilder<E>, callback?: QueryHook<E>) {
        qb.where(`${this.repository.qbName}.id = :id`, { id })
        if (callback) return callback(qb)
        return qb
    }

    protected async buildListQB(qb: SelectQueryBuilder<E>, options?: P, callback?: QueryHook<E>) {
        const { trashed } = options ?? {}
        const queryName = this.repository.qbName
        // 是否查询回收站
        if (
            this.enableTrash &&
            (trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY)
        ) {
            qb.withDeleted()
            if (trashed === SelectTrashMode.ONLY) {
                qb.where(`${queryName}.deletedAt is not null`)
            }
        }
        if (callback) return callback(qb)
        return qb
    }
}
