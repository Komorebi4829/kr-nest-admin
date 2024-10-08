import { Exclude, Expose } from 'class-transformer'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm'

import type { Relation } from 'typeorm'

import { UserEntity } from '@/modules/user/entities'

import { PostEntity } from './post.entity'

@Exclude()
@Tree('materialized-path')
@Entity('content_comments')
export class CommentEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Expose()
    @Column({ comment: '评论内容', type: 'text' })
    @Index({ fulltext: true })
    body: string

    @Expose()
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date

    @Expose({ groups: ['comment-list'] })
    depth = 0

    @Expose({ groups: ['comment-detail', 'comment-list'] })
    @TreeParent({ onDelete: 'CASCADE' })
    parent: Relation<CommentEntity> | null

    @Expose({ groups: ['comment-tree'] })
    @TreeChildren({ cascade: true })
    children: Relation<CommentEntity>[]

    @Expose()
    @ManyToOne(() => PostEntity, (post) => post.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    post: Relation<PostEntity>

    @Expose()
    @ManyToOne((type) => UserEntity, (user) => user.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    author: Relation<UserEntity>
}
