import { Exclude, Expose } from 'class-transformer'
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm'

import type { Relation } from 'typeorm'

import { MenuType } from '../constants'

// import { RoleEntity } from './role.entity'

@Exclude()
@Tree('materialized-path')
@Entity('role_menus')
export class MenuEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Expose()
    @Column({ comment: 'i18n 标签' })
    label: string

    @Expose()
    @Column({ comment: '菜单名称' })
    name: string

    @Expose()
    @Column({
        comment: '菜单类型',
        type: 'simple-enum',
        enum: MenuType,
        default: MenuType.CATALOGUE,
    })
    type: number

    @Expose()
    @Column({ comment: '菜单图标', nullable: true })
    icon?: string

    @Expose()
    @Column({ comment: '显示排序', default: 1 })
    customOrder: number

    @Expose()
    @Column({ comment: '是否外链', type: 'boolean', nullable: true })
    isFrame?: boolean

    @Expose()
    @Column({ comment: '外链地址', nullable: true })
    frameSrc?: string

    @Expose()
    @Column({ comment: '是否缓存', type: 'boolean', nullable: true })
    isCache?: boolean

    @Expose()
    @Column({ comment: '路由地址' })
    path: string

    @Expose()
    @Column({ comment: '组件路径', nullable: true })
    component?: string

    @Expose()
    @Column({ comment: '权限字符', nullable: true })
    perms?: string

    @Expose()
    @Column({ comment: '路由参数', nullable: true })
    query?: string

    @Expose()
    @Column({ comment: '显示状态', type: 'boolean', nullable: true })
    hide?: boolean

    @Expose()
    @Column({ comment: '菜单状态', type: 'boolean', nullable: true })
    status?: boolean

    @Expose()
    @Column({ comment: '是否新特性', type: 'boolean', nullable: true })
    newFeature?: boolean

    @Expose()
    @Column({ comment: '是否隐藏tab', type: 'boolean', nullable: true })
    hideTab?: boolean

    @Expose({ groups: ['menu-list'] })
    depth = 0

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @TreeParent({ onDelete: 'NO ACTION' })
    parent: Relation<MenuEntity> | null

    @Expose({ groups: ['menu-tree'] })
    @TreeChildren({ cascade: true })
    children: Relation<MenuEntity>[]

    // @OneToMany(() => PostEntity, (post) => post.category, {
    //     cascade: true,
    // })
    // posts: Relation<PostEntity[]>
}
