import { Exclude, Expose } from 'class-transformer'
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import type { Relation } from 'typeorm'

import { PostEntity } from './post.entity'

@Exclude()
@Entity('content_tags')
export class TagEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Expose()
    @Column({ comment: '分类名称' })
    @Index({ fulltext: true })
    name: string

    @Expose()
    @Column({ comment: '标签描述', nullable: true })
    description?: string

    @Expose()
    postCount: number

    @ManyToMany(() => PostEntity, (post) => post.tags)
    posts: Relation<PostEntity[]>
}
