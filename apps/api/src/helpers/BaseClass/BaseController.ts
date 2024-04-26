import { Body, Param, ParseUUIDPipe, Query } from '@nestjs/common'

import { DeleteWithTrashDto, DetailQueryDto, ListQueryDto, RestoreDto } from '../dtos'

export abstract class BaseController<S> {
    protected service: S

    constructor(service: S) {
        this.setService(service)
    }

    private setService(service: S) {
        this.service = service
    }

    async list(@Query() options: ListQueryDto, ...args: any[]) {
        return (this.service as any).paginate(options)
    }

    async detail(
        @Query() { trashed }: DetailQueryDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
        ...args: any[]
    ) {
        return (this.service as any).detail(item, trashed)
    }

    async store(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).create(data)
    }

    async update(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).update(data)
    }

    async delete(
        @Body()
        { ids, trash }: DeleteWithTrashDto,
        ...args: any[]
    ) {
        return (this.service as any).delete(ids, trash)
    }

    async restore(
        @Body()
        { ids }: RestoreDto,
        ...args: any[]
    ) {
        return (this.service as any).restore(ids)
    }
}
