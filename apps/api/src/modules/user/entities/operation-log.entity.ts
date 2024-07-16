import { Exclude, Expose } from 'class-transformer'

import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'

import type { Relation } from 'typeorm'

import { HttpMethod, OperationStatus, OperationType } from '../constants'

import { UserEntity } from './user.entity'

@Exclude()
@Entity('operation_logs')
export class OperationLogEntity extends BaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
    id: string

    @Expose()
    @Column({ comment: '操作的名称或描述', nullable: false })
    operation_name: string

    @Expose()
    @Column({
        comment: '操作类型（创建、读取、更新、删除、其它）',
        nullable: false,
        type: 'enum',
        enum: OperationType,
    })
    operation_type: OperationType

    @Expose()
    @Column({ comment: '操作时间', nullable: true })
    operation_time?: Date

    @Expose()
    @Column({ comment: '操作IP', nullable: true, length: 40 })
    operation_ip?: string

    @Expose()
    @Column({ comment: '设备信息如浏览器类型,操作系统等', length: 500, nullable: true })
    operation_device?: string

    @Expose()
    @Column({ comment: '请求URL', nullable: true })
    operation_url?: string

    @Expose()
    @Column({ comment: '操作状态', nullable: true, type: 'enum', enum: OperationStatus })
    status?: OperationStatus

    @Expose()
    @Column({ comment: '登录失败原因', nullable: true, length: 500 })
    fail_reason?: string

    @Expose()
    @Column({ comment: '执行时间', nullable: true, length: 20 })
    time?: string

    @Expose()
    @Column({ comment: '请求方法', nullable: true, type: 'enum', enum: HttpMethod })
    method?: HttpMethod

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.operationLogs, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: Relation<UserEntity>
}
