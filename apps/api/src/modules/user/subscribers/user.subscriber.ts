import { randomBytes } from 'crypto'

import { EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'

import { BaseSubscriber } from '@/helpers/BaseClass'
import { PermissionEntity, RoleEntity } from '@/modules/rbac/entities'

import { UserEntity } from '../entities/user.entity'
import { encrypt } from '../helpers'

@EventSubscriber()
export class UserSubscriber extends BaseSubscriber<UserEntity> {
    protected entity = UserEntity

    protected async generateUserName(event: InsertEvent<UserEntity>): Promise<string> {
        const username = `user_${randomBytes(4).toString('hex').slice(0, 8)}`
        const user = await event.manager.findOne(UserEntity, {
            where: { username },
        })
        return !user ? username : this.generateUserName(event)
    }

    async beforeInsert(event: InsertEvent<UserEntity>) {
        if (!event.entity.username) {
            event.entity.username = await this.generateUserName(event)
        }

        if (!event.entity.password) {
            event.entity.password = randomBytes(11).toString('hex').slice(0, 22)
        }

        event.entity.password = await encrypt(this.configure, event.entity.password)
    }

    async beforeUpdate(event: UpdateEvent<UserEntity>) {
        if (this.isUpdated('password', event)) {
            event.entity.password = await encrypt(this.configure, event.entity.password)
        }
    }

    async afterLoad(entity: UserEntity): Promise<void> {
        let permissions = (entity.permissions ?? []) as PermissionEntity[]
        for (const role of entity.roles ?? []) {
            const roleEntity = await RoleEntity.findOneOrFail({
                relations: ['permissions'],
                where: { id: role.id },
            })
            permissions = [...permissions, ...(roleEntity.permissions ?? [])]
        }
        entity.permissions = permissions.reduce((o, n) => {
            if (o.find(({ name }) => name === n.name)) return o
            return [...o, n]
        }, [])
    }
}
