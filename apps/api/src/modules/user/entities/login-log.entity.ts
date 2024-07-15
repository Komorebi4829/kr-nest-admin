import { Exclude, Expose } from 'class-transformer'

import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'

import type { Relation } from 'typeorm'

import { LoginStatus } from '../constants'

import { UserEntity } from './user.entity'

@Exclude()
@Entity('login_logs')
export class LoginLogEntity extends BaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
    id: string

    @Expose()
    @Column({ comment: '登录时间', nullable: true })
    login_time?: Date

    @Expose()
    @Column({ comment: '登录IP', nullable: true, length: 40 })
    login_ip?: string

    @Expose()
    @Column({ comment: '设备信息如浏览器类型,操作系统等', length: 500, nullable: true })
    login_device?: string

    @Expose()
    @Column({
        comment: '登录状态',
        nullable: true,
        type: 'enum',
        enum: LoginStatus,
    })
    status?: LoginStatus

    @Expose()
    @Column({ comment: '登录失败原因', nullable: true, length: 500 })
    fail_reason?: string

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.loginLogs, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: Relation<UserEntity>
}
