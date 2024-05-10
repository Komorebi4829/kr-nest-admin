import { Exclude, Expose } from 'class-transformer'
import {
    BaseEntity,
    Column,
    Entity,
    Index,
    PrimaryColumn,
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
    @PrimaryColumn({ type: 'int', generated: true })
    id: string

    @Expose()
    @Column({ comment: '菜单名称' })
    @Index({ fulltext: true })
    name: string

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({
        comment: '菜单类型',
        type: 'simple-enum',
        enum: MenuType,
        default: MenuType.CATALOGUE,
    })
    type: number

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '菜单图标', nullable: true })
    icon?: string

    @Expose({ groups: ['menu-tree', 'menu-list', 'menu-detail'] })
    @Column({ comment: '显示排序', default: 0 })
    customOrder: number

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '是否外链', type: 'boolean', nullable: true })
    isFrame?: number

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '是否缓存', type: 'boolean', nullable: true })
    isCache?: number

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '路由地址' })
    path: string

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '组件路径', nullable: true })
    component?: string

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '权限字符', nullable: true })
    perms?: string

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '路由参数', nullable: true })
    query?: string

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '显示状态', type: 'boolean', nullable: true })
    visible?: string

    @Expose({ groups: ['menu-detail', 'menu-list'] })
    @Column({ comment: '菜单状态', type: 'boolean', nullable: true })
    status?: string

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
