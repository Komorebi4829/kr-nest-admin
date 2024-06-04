import { isNil, omit } from 'lodash'
import { DataSource, EntityManager } from 'typeorm'

import type { MenuItem } from '@/database/datas/menu.data'
import { MENUS } from '@/database/datas/menu.data'
import { BaseSeeder } from '@/helpers/BaseClass'
import { DbFactory } from '@/modules/database/types'
import { MenuEntity } from '@/modules/rbac/entities'

export default class MenuSeeder extends BaseSeeder {
    protected truncates = [MenuEntity]

    protected factorier!: DbFactory

    async run(_factorier: DbFactory, _dataSource: DataSource, _em: EntityManager): Promise<any> {
        this.factorier = _factorier
        await this.queryRunner.startTransaction()
        await this.loadMenus(MENUS, this.em)
        await this.queryRunner.commitTransaction()
    }

    private async loadMenus(menus: MenuItem[], manager: EntityManager) {
        await this.traverse(menus, null, manager)
    }

    private async traverse(menus: MenuItem[], parent: any, manager: EntityManager) {
        for (const [index, menu] of menus.entries()) {
            let savedMenu = await manager.findOne(MenuEntity, { where: { label: menu.label } })
            if (isNil(savedMenu)) {
                const menuEntity = manager.create<MenuEntity>(MenuEntity, {
                    ...omit(menu, 'children', 'parent'),
                    isFrame: isNil(menu.isFrame) ? false : menu.isFrame,
                    isCache: isNil(menu.isCache) ? true : menu.isCache,
                    hide: isNil(menu.hide) ? false : menu.hide,
                    status: isNil(menu.status) ? 1 : menu.status,
                    parent: parent || null,
                    customOrder: index + 1,
                })

                savedMenu = await manager.save(MenuEntity, menuEntity)
            } else {
                await manager.update(MenuEntity, savedMenu.id, omit(menu, 'children', 'parent'))
            }

            if (menu.children && menu.children.length) {
                await this.traverse(menu.children, savedMenu, manager)
            }
        }
    }
}
