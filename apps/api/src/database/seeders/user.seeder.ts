import { isNil } from 'lodash'
import { DataSource, EntityManager } from 'typeorm'

import { BaseSeeder } from '@/helpers/BaseClass'
import { getCustomRepository } from '@/modules/database/helpers'
import { DbFactory } from '@/modules/database/types'
import { SystemRoles } from '@/modules/rbac/constants'
import { PermissionEntity, RoleEntity } from '@/modules/rbac/entities'
import { RbacBootstrap } from '@/modules/rbac/rbac.bootstrap'
import { RoleRepository } from '@/modules/rbac/repositories'
import { AccessTokenEntity, RefreshTokenEntity, UserEntity } from '@/modules/user/entities'
import { UserRepository } from '@/modules/user/repositories'

import { IUserFactoryOptions } from '../factories/user.factory'

export default class UserSeeder extends BaseSeeder {
    protected truncates = [
        UserEntity,
        AccessTokenEntity,
        RefreshTokenEntity,
        RoleEntity,
        PermissionEntity,
        'rbac_roles_users_users',
    ]

    protected factorier!: DbFactory

    async run(_factorier: DbFactory, _dataSource: DataSource, _em: EntityManager): Promise<any> {
        this.factorier = _factorier
        const rbac = new RbacBootstrap(this.dataSource, this.configure)

        await this.queryRunner.startTransaction()
        await rbac.syncRoles(this.em)
        await rbac.syncPermissions(this.em)
        await this.queryRunner.commitTransaction()

        await this.queryRunner.startTransaction()
        await this.loadSuperUser(rbac)
        await this.loadUsers()
        await this.queryRunner.commitTransaction()
    }

    private async loadSuperUser(rbac: RbacBootstrap) {
        const repository = getCustomRepository(this.dataSource, UserRepository)
        const creator = await repository.findOneBy({ username: 'superAdmin' })
        const demoUser = await repository.findOneBy({ username: 'demo' })
        const userFactory = this.factorier(UserEntity)
        if (isNil(creator)) {
            await userFactory<IUserFactoryOptions>({
                username: 'superAdmin',
                nickname: 'superAdmin',
                password: '123456sS$',
            }).create({}, 'username')
        }
        if (isNil(demoUser)) {
            await userFactory<IUserFactoryOptions>({
                username: 'demo',
                nickname: 'demo',
                phone: '+86.13012346679',
                password: 'Demo123!@',
            }).create({}, 'username')
        }
        await rbac.syncSuperAdmin(this.em)
    }

    private async loadUsers() {
        const userRole = await getCustomRepository(this.dataSource, RoleRepository).findOneBy({
            name: SystemRoles.USER,
        })
        const roles = isNil(userRole) ? [] : [userRole]
        const repository = getCustomRepository(this.dataSource, UserRepository)
        const userFactory = this.factorier(UserEntity)
        const count = await repository.count()
        if (count < 3) {
            await userFactory<IUserFactoryOptions>({
                username: 'libai',
                nickname: '李白',
                phone: '+86.13012345678',
                password: '123456aA!/',
                roles,
            }).create({}, 'username')

            await userFactory<IUserFactoryOptions>({
                username: 'sushi',
                nickname: '苏轼',
                phone: '+86.13012345679',
                password: '123456aA!/',
                roles,
            }).create({}, 'username')

            await userFactory<IUserFactoryOptions>().createMany(15, { roles }, 'username')
        }
    }
}
