import { AbilityOptions, AbilityTuple, MongoQuery, SubjectType } from '@casl/ability'
import { Injectable, InternalServerErrorException, OnApplicationBootstrap } from '@nestjs/common'

import { isArray, isNil, omit } from 'lodash'
import { DataSource, EntityManager, In, Not } from 'typeorm'

import { deepMerge } from '@/utils/common'

import { Configure } from '../config/configure'

import { UserEntity } from '../user/entities'

import { SystemRoles } from './constants'
import { PermissionEntity, RoleEntity } from './entities'
import { PermissionType, Role } from './types'

const getSubject = <S extends SubjectType>(subject: S) => {
    if (typeof subject === 'string') return subject
    if (subject.modelName) return subject
    return subject.name
}

@Injectable()
export class RbacBootstrap<A extends AbilityTuple = AbilityTuple, C extends MongoQuery = MongoQuery>
    implements OnApplicationBootstrap
{
    protected setuped = false

    protected options: AbilityOptions<A, C>

    protected _roles: Role[] = [
        {
            name: SystemRoles.USER,
            label: '普通用户',
            description: '新用户的默认角色',
            permissions: [],
        },
        {
            name: SystemRoles.SUPER_ADMIN,
            label: '超级管理员',
            description: '拥有整个系统的管理权限',
            permissions: [],
        },
    ]

    protected _permissions: PermissionType<A, C>[] = [
        {
            name: 'system-manage',
            label: '系统管理',
            description: '管理系统的所有功能',
            rule: {
                action: 'manage',
                subject: 'all',
            } as any,
        },
    ]

    constructor(
        protected dataSource: DataSource,
        protected configure: Configure,
    ) {}

    setOptions(options: AbilityOptions<A, C>) {
        if (!this.setuped) {
            this.options = options
            this.setuped = true
        }
        return this
    }

    get roles() {
        return this._roles
    }

    get permissions() {
        return this._permissions
    }

    addRoles(data: Role[]) {
        this._roles = [...this.roles, ...data]
    }

    addPermissions(data: PermissionType<A, C>[]) {
        this._permissions = [...this.permissions, ...data].map((item) => {
            let subject: typeof item.rule.subject
            if (isArray(item.rule.subject)) {
                subject = item.rule.subject.map((it) => getSubject(it))
            } else {
                subject = getSubject(item.rule.subject)
            }
            const rule = { ...item.rule, subject }
            return { ...item, rule }
        })
    }

    async syncRoles(manager: EntityManager) {
        this._roles = this.roles.reduce((o, n) => {
            if (o.map(({ name }) => name).includes(n.name)) {
                return o.map((e) => (e.name === n.name ? deepMerge(e, n, 'merge') : e))
            }
            return [...o, n]
        }, [])

        for (const item of this.roles) {
            let role = await manager.findOne(RoleEntity, {
                relations: ['permissions'],
                where: {
                    name: item.name,
                },
            })

            if (isNil(role)) {
                role = await manager.save(
                    manager.create(RoleEntity, {
                        name: item.name,
                        label: item.label,
                        description: item.description,
                        systemed: true,
                    }),
                    { reload: true },
                )
            } else {
                await manager.update(RoleEntity, role.id, { systemed: true })
            }
        }

        const systemRoles = await manager.findBy(RoleEntity, { systemed: true })
        const toDels: string[] = []
        for (const sRole of systemRoles) {
            if (isNil(this.roles.find(({ name }) => sRole.name === name))) {
                toDels.push(sRole.id)
            }
        }
        if (toDels.length > 0) {
            await manager.delete(RoleEntity, toDels)
        }
    }

    async syncPermissions(manager: EntityManager) {
        const permissions = await manager.find(PermissionEntity)
        const roles = await manager.find(RoleEntity, {
            relations: ['permissions'],
            where: { name: Not(SystemRoles.SUPER_ADMIN) },
        })
        const roleRepo = manager.getRepository(RoleEntity)

        this._permissions = this.permissions.reduce(
            (o, n) => (o.map(({ name }) => name).includes(n.name) ? o : [...o, n]),
            [],
        )
        const names = this.permissions.map(({ name }) => name)

        for (const item of this.permissions) {
            const permission = omit(item, ['conditions'])
            const old = await manager.findOneBy(PermissionEntity, {
                name: permission.name,
            })
            if (isNil(old)) {
                await manager.save(manager.create(PermissionEntity, permission))
            } else {
                await manager.update(PermissionEntity, old.id, permission)
            }
        }

        const toDels: string[] = []
        for (const item of permissions) {
            if (!names.includes(item.name) && item.name !== 'system-manage') {
                toDels.push(item.id)
            }
        }
        if (toDels.length > 0) {
            await manager.delete(PermissionEntity, toDels)
        }

        for (const role of roles) {
            const rolePermissions = await manager.findBy(PermissionEntity, {
                name: In(this.roles.find(({ name }) => name === role.name).permissions),
            })
            await roleRepo
                .createQueryBuilder('role')
                .relation(RoleEntity, 'permissions')
                .of(role)
                .addAndRemove(
                    rolePermissions.map(({ id }) => id),
                    (role.permissions ?? []).map(({ id }) => id),
                )
        }

        const superRole = await manager.findOneOrFail(RoleEntity, {
            relations: ['permissions'],
            where: { name: SystemRoles.SUPER_ADMIN },
        })

        const systemManage = await manager.findOneOrFail(PermissionEntity, {
            where: { name: 'system-manage' },
        })

        await roleRepo
            .createQueryBuilder('role')
            .relation(RoleEntity, 'permissions')
            .of(superRole)
            .addAndRemove(
                [systemManage.id],
                (superRole.permissions ?? []).map(({ id }) => id),
            )
    }

    async syncSuperAdmin(manager: EntityManager) {
        const superRole = await manager.findOneOrFail(RoleEntity, {
            relations: ['permissions'],
            where: { name: SystemRoles.SUPER_ADMIN },
        })

        const superUsers = await manager
            .createQueryBuilder(UserEntity, 'user')
            .leftJoinAndSelect('user.roles', 'roles')
            .where('roles.id IN (:...ids)', { ids: [superRole.id] })
            .getMany()
        if (superUsers.length < 1) {
            const userRepo = manager.getRepository(UserEntity)
            if ((await userRepo.count()) < 1) {
                throw new InternalServerErrorException(
                    'Please add a super-admin user first before run server!',
                )
            }
            const admin = await userRepo.findOneByOrFail({ nickname: 'superAdmin' })
            await userRepo
                .createQueryBuilder('user')
                .relation(UserEntity, 'roles')
                .of(admin)
                .addAndRemove(
                    [superRole.id],
                    ((admin.roles ?? []) as RoleEntity[]).map(({ id }) => id),
                )

            const demoUser = await userRepo.findOneByOrFail({ nickname: 'demo' })
            await userRepo
                .createQueryBuilder('user')
                .relation(UserEntity, 'roles')
                .of(demoUser)
                .addAndRemove(
                    [superRole.id],
                    ((demoUser.roles ?? []) as RoleEntity[]).map(({ id }) => id),
                )
        }
    }

    async onApplicationBootstrap() {
        if (!this.dataSource.isInitialized) return null

        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            await this.syncRoles(queryRunner.manager)
            await this.syncPermissions(queryRunner.manager)
            await this.syncSuperAdmin(queryRunner.manager)
        } catch (err) {
            console.log(err)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        return true
    }
}
