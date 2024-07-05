import { Exclude, Expose } from 'class-transformer'
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm'

import { DictItemEntity } from './dict-item.entity'

@Exclude()
@Entity('dicts')
export class DictEntity extends BaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36, comment: '字典编号' })
    id: string

    @Expose()
    @Column({ comment: '字典编码' })
    code: string

    @Expose()
    @Column({ comment: '字典名称' })
    name: string

    @Expose()
    @Column({ comment: '是否系统内置, 1是 0否', type: 'tinyint', default: 0 })
    systemFlag: number

    @Expose()
    @Column({ comment: '备注信息', nullable: true })
    remark?: string

    @Expose()
    @Column({ comment: '启用状态, 1启用 0停用', type: 'tinyint', nullable: true, default: 1 })
    status?: number

    @Expose()
    @OneToMany(() => DictItemEntity, (dictItem) => dictItem.dict, {
        cascade: true,
    })
    dictItems: Relation<DictItemEntity>[]
}
