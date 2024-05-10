import { pick, unset } from 'lodash'
import { FindOptionsUtils, FindTreeOptions } from 'typeorm'

import { BaseTreeRepository } from '@/helpers/BaseClass'
import { OrderType, TreeChildrenResolve } from '@/modules/database/constants'
import { CustomRepository } from '@/modules/database/decorators'

import { MenuEntity } from '../entities'

@CustomRepository(MenuEntity)
export class MenuRepository extends BaseTreeRepository<MenuEntity> {
    protected _qbName = 'menu'

    protected orderBy = { name: 'customOrder', order: OrderType.ASC }

    protected _childrenResolve = TreeChildrenResolve.UP

    buildBaseQB() {
        return this.createQueryBuilder('menu').leftJoinAndSelect('menu.parent', 'parent')
    }

    async findTrees(
        options?: FindTreeOptions & {
            onlyTrashed?: boolean
            withTrashed?: boolean
        },
    ) {
        const roots = await this.findRoots(options)
        await Promise.all(roots.map((root) => this.findDescendantsTree(root, options)))
        return roots
    }

    findRoots(
        options?: FindTreeOptions & {
            onlyTrashed?: boolean
            withTrashed?: boolean
        },
    ) {
        const escapeAlias = (alias: string) => this.manager.connection.driver.escape(alias)
        const escapeColumn = (column: string) => this.manager.connection.driver.escape(column)

        const joinColumn = this.metadata.treeParentRelation!.joinColumns[0]
        const parentPropertyName = joinColumn.givenDatabaseName || joinColumn.databaseName
        const qb = this.buildBaseQB().orderBy('menu.customOrder', 'ASC')
        qb.where(`${escapeAlias('menu')}.${escapeColumn(parentPropertyName)} IS NULL`)
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(options, ['relations', 'depth']))
        if (options?.withTrashed) {
            qb.withDeleted()
            if (options?.onlyTrashed) qb.where(`menu.deletedAt IS NOT NULL`)
        }
        return qb.getMany()
    }

    findDescendants(
        entity: MenuEntity,
        options?: FindTreeOptions & {
            onlyTrashed?: boolean
            withTrashed?: boolean
        },
    ) {
        const qb = this.createDescendantsQueryBuilder('menu', 'treeClosure', entity)
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, options)
        qb.orderBy('menu.customOrder', 'ASC')
        if (options?.withTrashed) {
            qb.withDeleted()
            if (options?.onlyTrashed) qb.where(`menu.deletedAt IS NOT NULL`)
        }
        return qb.getMany()
    }

    findAncestors(
        entity: MenuEntity,
        options?: FindTreeOptions & {
            onlyTrashed?: boolean
            withTrashed?: boolean
        },
    ) {
        const qb = this.createAncestorsQueryBuilder('menu', 'treeClosure', entity)
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, options)
        qb.orderBy('menu.customOrder', 'ASC')
        if (options?.withTrashed) {
            qb.withDeleted()
            if (options?.onlyTrashed) qb.where(`menu.deletedAt IS NOT NULL`)
        }
        return qb.getMany()
    }

    async countDescendants(
        entity: MenuEntity,
        options?: { withTrashed?: boolean; onlyTrashed?: boolean },
    ) {
        const qb = this.createDescendantsQueryBuilder('menu', 'treeClosure', entity)
        if (options?.withTrashed) {
            qb.withDeleted()
            if (options?.onlyTrashed) qb.where(`menu.deletedAt IS NOT NULL`)
        }
        return qb.getCount()
    }

    async countAncestors(
        entity: MenuEntity,
        options?: { withTrashed?: boolean; onlyTrashed?: boolean },
    ) {
        const qb = this.createAncestorsQueryBuilder('menu', 'treeClosure', entity)
        if (options?.withTrashed) {
            qb.withDeleted()
            if (options?.onlyTrashed) qb.where(`menu.deletedAt IS NOT NULL`)
        }
        return qb.getCount()
    }

    async toFlatTrees(trees: MenuEntity[], depth = 0, parent: MenuEntity | null = null) {
        const data: Omit<MenuEntity, 'children'>[] = []
        for (const item of trees) {
            item.depth = depth
            item.parent = parent
            const { children } = item
            unset(item, 'children')
            data.push(item)
            data.push(...(await this.toFlatTrees(children, depth + 1, item)))
        }
        return data as MenuEntity[]
    }
}
