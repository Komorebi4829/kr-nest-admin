import { Exclude, Expose } from 'class-transformer'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm'

import { DictEntity } from './dict.entity'

@Exclude()
@Entity('dict_items')
export class DictItemEntity extends BaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
    id: string

    @Expose()
    @Column({ comment: '标签名' })
    label: string

    @Expose()
    @Column({ comment: '数据值' })
    value: string

    @Expose()
    @Column({ comment: '描述', nullable: true })
    description: string

    @Expose()
    @Column({ comment: '排序值，默认升序', nullable: true })
    sortOrder: number

    @Expose()
    @Column({ comment: '备注信息', nullable: true })
    remark?: string

    @Expose()
    @Column({ comment: '启用状态', type: 'tinyint', nullable: true, default: 1 })
    status?: number

    @Expose()
    @ManyToOne(() => DictEntity, (dict) => dict.dictItems, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    dict: Relation<DictEntity>
}
