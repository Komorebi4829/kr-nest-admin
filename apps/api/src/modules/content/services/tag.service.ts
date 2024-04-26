import { Injectable } from '@nestjs/common'

import { omit } from 'lodash'

import { BaseService } from '@/helpers/BaseClass'

import { CreateTagDto, UpdateTagDto } from '../dtos'
import { TagEntity } from '../entities'
import { TagRepository } from '../repositories'

@Injectable()
export class TagService extends BaseService<TagEntity, TagRepository> {
    constructor(protected repository: TagRepository) {
        super(repository)
    }

    async create(data: CreateTagDto) {
        const item = await this.repository.save(data)
        return this.detail(item.id)
    }

    async update(data: UpdateTagDto) {
        await this.repository.update(data.id, omit(data, ['id']))
        return this.detail(data.id)
    }
}
