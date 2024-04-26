import { Injectable } from '@nestjs/common'

import { isArray, isFunction, isNil, omit, pick } from 'lodash'

import { EntityNotFoundError, In, IsNull, Not, SelectQueryBuilder } from 'typeorm'

import { BaseService } from '@/helpers/BaseClass'
import { SelectTrashMode } from '@/modules/database/constants'
import { paginate } from '@/modules/database/helpers'
import { QueryHook } from '@/modules/database/types'

import { UserEntity } from '@/modules/user/entities'
import { UserRepository } from '@/modules/user/repositories'

import { PostOrderType } from '../constants'
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos'
import { PostEntity } from '../entities'
import { CategoryRepository, PostRepository, TagRepository } from '../repositories'

import type { SearchType } from '../types'

import { CategoryService } from './category.service'
import { SearchService } from './search.service'

type FindParams = {
    [key in keyof Omit<QueryPostDto, 'limit' | 'page'>]: QueryPostDto[key]
}

@Injectable()
export class PostService extends BaseService<PostEntity, PostRepository, FindParams> {
    protected enableTrash = true

    constructor(
        protected repository: PostRepository,
        protected categoryRepository: CategoryRepository,
        protected categoryService: CategoryService,
        protected tagRepository: TagRepository,
        protected userRepository: UserRepository,
        protected searchService?: SearchService,
        protected search_type: SearchType = 'against',
    ) {
        super(repository)
    }

    async paginate(options: QueryPostDto, callback?: QueryHook<PostEntity>) {
        if (!isNil(this.searchService) && !isNil(options.search) && this.search_type === 'meilli') {
            return this.searchService.search(
                options.search,
                pick(options, ['trashed', 'page', 'limit']),
            ) as any
        }
        const qb = await this.buildListQuery(this.repository.buildBaseQB(), options, callback)
        return paginate(qb, options)
    }

    async detail(id: string, callback?: QueryHook<PostEntity>) {
        let qb = this.repository.buildBaseQB()
        qb.where(`post.id = :id`, { id })
        qb = !isNil(callback) && isFunction(callback) ? await callback(qb) : qb
        const item = await qb.getOne()
        if (!item) throw new EntityNotFoundError(PostEntity, `The post ${id} not exists!`)
        return item
    }

    async create(data: CreatePostDto, author: ClassToPlain<UserEntity>) {
        let publishedAt: Date | null
        // if (!isNil(data.publish)) {
        //     publishedAt = data.publish ? new Date() : null
        // }
        const authorId = isNil((data as CreatePostDto).author)
            ? author.id
            : (data as CreatePostDto).author

        const createPostDto = {
            ...omit(data, ['publish', 'author']),

            author: await this.userRepository.findOneByOrFail({ id: authorId }),

            category: !isNil(data.category)
                ? await this.categoryRepository.findOneOrFail({ where: { id: data.category } })
                : null,

            tags: isArray(data.tags)
                ? await this.tagRepository.findBy({
                      id: In(data.tags),
                  })
                : [],
            publishedAt,
        }
        const item = await this.repository.save(createPostDto)
        const result = await this.detail(item.id)
        if (!isNil(this.searchService)) await this.searchService.create(result)
        return result
    }

    async update(data: UpdatePostDto) {
        const post = await this.detail(data.id)
        if (!isNil(data.author)) {
            const author = await this.userRepository.findOneByOrFail({ id: data.author })
            post.author = author
            await this.repository.save(author, { reload: true })
        }
        if (data.category !== undefined) {
            const category = isNil(data.category)
                ? null
                : await this.categoryRepository.findOneByOrFail({ id: data.category })
            post.category = category
            await this.repository.save(post)
        }
        if (isArray(data.tags)) {
            await this.repository
                .createQueryBuilder('post')
                .relation(PostEntity, 'tags')
                .of(post)
                .addAndRemove(data.tags, post.tags ?? [])
        }
        await this.repository.update(data.id, omit(data, ['id', 'tags', 'category', 'author']))
        const result = await this.detail(data.id)
        if (!isNil(this.searchService)) await this.searchService.update([post])
        return result
    }

    async delete(ids: string[], trash?: boolean) {
        const items = await this.repository.find({
            where: { id: In(ids) },
            withDeleted: true,
        })
        let result: PostEntity[] = []
        if (trash) {
            const directs = items.filter((item) => !isNil(item.deletedAt))
            const softs = items.filter((item) => isNil(item.deletedAt))
            result = [
                ...(await this.repository.remove(directs)),
                ...(await this.repository.softRemove(softs)),
            ]
            if (!isNil(this.searchService)) {
                await this.searchService.delete(directs.map(({ id }) => id))
                await this.searchService.update(softs)
            }
        } else {
            result = await this.repository.remove(items)
            if (!isNil(this.searchService)) {
                await this.searchService.delete(result.map(({ id }) => id))
            }
        }
        return result
    }

    async restore(ids: string[]) {
        const items = await this.repository.find({
            where: { id: In(ids) },
            withDeleted: true,
        })

        const trasheds = items.filter((item) => !isNil(item)).map((item) => item.id)
        if (trasheds.length < 1) return []
        await this.repository.restore(trasheds)
        const qb = await this.buildListQuery(this.repository.buildBaseQB(), {}, async (qbuilder) =>
            qbuilder.andWhereInIds(trasheds),
        )
        return qb.getMany()
    }

    protected async buildListQuery(
        qb: SelectQueryBuilder<PostEntity>,
        options: FindParams,
        callback?: QueryHook<PostEntity>,
    ) {
        const {
            category,
            tag,
            orderBy,
            author,
            isPublished,
            trashed = SelectTrashMode.NONE,
        } = options

        if (trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY) {
            qb.withDeleted()
            if (trashed === SelectTrashMode.ONLY) qb.where(`post.deletedAt is not null`)
        }
        if (typeof isPublished === 'boolean') {
            isPublished
                ? qb.where({
                      publishedAt: Not(IsNull()),
                  })
                : qb.where({
                      publishedAt: IsNull(),
                  })
        }

        this.queryOrderBy(qb, orderBy)
        if (category) await this.queryByCategory(category, qb)
        if (!isNil(options.search)) this.buildSearchQuery(qb, options.search)

        if (tag) qb.where('tags.id = :id', { id: tag })
        if (author) qb.where('author.id = :id', { id: author })
        if (callback) return callback(qb)
        return qb
    }

    protected async buildSearchQuery(qb: SelectQueryBuilder<PostEntity>, search: string) {
        if (this.search_type === 'like') {
            qb.andWhere('title LIKE :search', { search: `%${search}%` })
                .orWhere('body LIKE :search', { search: `%${search}%` })
                .orWhere('summary LIKE :search', { search: `%${search}%` })
                .orWhere('category.name LIKE :search', {
                    search: `%${search}%`,
                })
                .orWhere('tags.name LIKE :search', {
                    search: `%${search}%`,
                })
                .orWhere('author.username LIKE :search', {
                    search: `%${search}%`,
                })
                .orWhere('author.nickname LIKE :search', {
                    search: `%${search}%`,
                })
        } else if (this.search_type === 'against') {
            qb.andWhere('MATCH(title) AGAINST (:search IN BOOLEAN MODE)', {
                search: `${search}*`,
            })
                .orWhere('MATCH(body) AGAINST (:search IN BOOLEAN MODE)', {
                    search: `${search}*`,
                })
                .orWhere('MATCH(summary) AGAINST (:search IN BOOLEAN MODE)', {
                    search: `${search}*`,
                })
                .orWhere('MATCH(category.name) AGAINST (:search IN BOOLEAN MODE)', {
                    search: `${search}*`,
                })
                .orWhere('MATCH(tags.name) AGAINST (:search IN BOOLEAN MODE)', {
                    search: `${search}*`,
                })
                .orWhere('MATCH(author.username) AGAINST (:search IN BOOLEAN MODE)', {
                    search: `${search}*`,
                })
                .orWhere('MATCH(author.nickname) AGAINST (:search IN BOOLEAN MODE)', {
                    search: `${search}*`,
                })
        }
        return qb
    }

    protected queryOrderBy(qb: SelectQueryBuilder<PostEntity>, orderBy?: PostOrderType) {
        switch (orderBy) {
            case PostOrderType.CREATED:
                return qb.orderBy('post.createdAt', 'DESC')
            case PostOrderType.UPDATED:
                return qb.orderBy('post.updatedAt', 'DESC')
            case PostOrderType.PUBLISHED:
                return qb.orderBy('post.publishedAt', 'DESC')
            case PostOrderType.COMMENTCOUNT:
                return qb.orderBy('commentCount', 'DESC')
            case PostOrderType.CUSTOM:
                return qb.orderBy('customOrder', 'DESC')
            default:
                return qb
                    .orderBy('post.createdAt', 'DESC')
                    .addOrderBy('post.updatedAt', 'DESC')
                    .addOrderBy('post.publishedAt', 'DESC')
                    .addOrderBy('commentCount', 'DESC')
        }
    }

    protected async queryByCategory(id: string, qb: SelectQueryBuilder<PostEntity>) {
        const root = await this.categoryService.detail(id)
        const tree = await this.categoryRepository.findDescendantsTree(root)
        const flatDes = await this.categoryRepository.toFlatTrees(tree.children)
        const ids = [tree.id, ...flatDes.map((item) => item.id)]
        return qb.where('category.id IN (:...ids)', {
            ids,
        })
    }
}
