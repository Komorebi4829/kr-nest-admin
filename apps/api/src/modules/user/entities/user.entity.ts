import { Exclude, Expose, Type } from 'class-transformer'

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

import type { Relation } from 'typeorm'

import { CommentEntity, PostEntity } from '@/modules/content/entities'

import { PermissionEntity, RoleEntity } from '@/modules/rbac/entities'

import { AccessTokenEntity } from './access-token.entity'
import { LoginLogEntity } from './login-log.entity'
import { OperationLogEntity } from './operation-log.entity'

@Exclude()
@Entity('users')
export class UserEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Expose()
    @Column({
        comment: '姓名',
        nullable: true,
    })
    nickname?: string

    @Expose()
    @Column({ comment: '用户名', unique: true })
    username: string

    @Column({ comment: '密码', length: 500, select: false })
    password: string

    @Expose()
    @Column({ comment: '手机号', nullable: true, unique: true })
    phone?: string

    @Expose()
    @Column({ comment: '邮箱', nullable: true, unique: true })
    email?: string

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '用户创建时间',
    })
    createdAt: Date

    @Expose()
    @Type(() => Date)
    @UpdateDateColumn({
        comment: '用户更新时间',
    })
    updatedAt: Date

    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt: Date

    @Expose()
    @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
        cascade: true,
    })
    accessTokens: Relation<AccessTokenEntity>[]

    @OneToMany(() => PostEntity, (post) => post.author, {
        cascade: true,
    })
    posts: Relation<PostEntity>[]

    @OneToMany(() => CommentEntity, (comment) => comment.author, {
        cascade: true,
    })
    comments: Relation<CommentEntity>[]

    @Expose()
    @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
    roles: Relation<RoleEntity>[]

    @Expose()
    @ManyToMany(() => PermissionEntity, (permisson) => permisson.users, {
        cascade: true,
    })
    permissions: Relation<PermissionEntity>[]

    @OneToMany(() => LoginLogEntity, (loginLog) => loginLog.user, {
        cascade: true,
    })
    loginLogs: Relation<LoginLogEntity>[]

    @OneToMany(() => OperationLogEntity, (operationLog) => operationLog.user, {
        cascade: true,
    })
    operationLogs: Relation<LoginLogEntity>[]
}
