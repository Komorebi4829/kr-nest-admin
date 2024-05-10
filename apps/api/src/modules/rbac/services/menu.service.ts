import { Injectable } from '@nestjs/common'

import { isNil, omit } from 'lodash'

import { EntityNotFoundError } from 'typeorm'

import { BaseService } from '@/helpers/BaseClass'
import { PaginateWithTrashedDto } from '@/helpers/dtos'
import { SelectTrashMode } from '@/modules/database/constants'
import { treePaginate } from '@/modules/database/helpers'

import { CreateMenuDto, QueryMenuTreeDto, UpdateMenuDto } from '../dtos'
import { MenuEntity } from '../entities'
import { MenuRepository } from '../repositories'

@Injectable()
export class MenuService extends BaseService<MenuEntity, MenuRepository> {
    constructor(protected repository: MenuRepository) {
        super(repository)
    }

    async findTrees(options: QueryMenuTreeDto) {
        const { trashed = SelectTrashMode.NONE } = options
        return this.repository.findTrees({
            withTrashed: trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY,
            onlyTrashed: trashed === SelectTrashMode.ONLY,
        })
    }

    async paginate(options: PaginateWithTrashedDto) {
        const { trashed = SelectTrashMode.NONE } = options
        const tree = await this.repository.findTrees({
            withTrashed: trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY,
            onlyTrashed: trashed === SelectTrashMode.ONLY,
        })
        const data = await this.repository.toFlatTrees(tree)
        return treePaginate(options, data)
    }

    async detail(id: string) {
        return this.repository.findOneOrFail({
            where: { id },
            relations: ['parent'],
        })
    }

    async create(data: CreateMenuDto) {
        const item = await this.repository.save({
            ...data,
            parent: await this.getParent(undefined, data.parent),
        })
        return this.detail(item.id)
    }

    async update(data: UpdateMenuDto) {
        await this.repository.update(data.id, omit(data, ['id', 'parent']))
        await this.detail(data.id)
        const item = await this.repository.findOneOrFail({
            where: { id: data.id },
            relations: ['parent'],
        })
        const parent = await this.getParent(item.parent?.id, data.parent)
        const shouldUpdateParent =
            (!isNil(item.parent) && !isNil(parent) && item.parent.id !== parent.id) ||
            (isNil(item.parent) && !isNil(parent)) ||
            (!isNil(item.parent) && isNil(parent))

        if (parent !== undefined && shouldUpdateParent) {
            item.parent = parent
            await this.repository.save(item, { reload: true })
        }
        return item
    }

    protected async getParent(current?: string, parentId?: string) {
        if (current === parentId) return undefined
        let parent: MenuEntity | undefined
        if (parentId !== undefined) {
            if (parentId === null) return null
            parent = await this.repository.findOne({ where: { id: parentId } })
            if (!parent)
                throw new EntityNotFoundError(MenuEntity, `Parent menu ${parentId} not exists!`)
        }
        return parent
    }
}
