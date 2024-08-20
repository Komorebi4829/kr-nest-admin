import { Exclude, Expose } from 'class-transformer'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { DictItemEntity } from './dict-item.entity'

@Exclude()
@Entity('dicts')
export class DictEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid', { comment: '字典编号' })
    id: string

    @Expose()
    @Column({ comment: '字典编码' })
    code: string

    @Expose()
    @Column({ comment: '字典名称' })
    name: string

    @Expose()
    @Column({ comment: '是否系统内置, 是 否', type: 'boolean', default: false })
    systemFlag: boolean

    @Expose()
    @Column({ comment: '备注信息', nullable: true })
    remark?: string

    @Expose()
    @Column({ comment: '启用状态, 启用 停用', type: 'boolean', nullable: true, default: true })
    status?: boolean

    @Expose()
    @OneToMany(() => DictItemEntity, (dictItem) => dictItem.dict, {
        cascade: true,
    })
    dictItems: Relation<DictItemEntity>[]
}
