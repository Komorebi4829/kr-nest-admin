import { Injectable } from '@nestjs/common'

import { isNil } from 'lodash'
import MeiliSearch from 'meilisearch'

import type { MelliConfig } from './types'

@Injectable()
export class MeilliService {
    protected options: MelliConfig

    protected clients: Map<string, MeiliSearch> = new Map()

    constructor(options: MelliConfig) {
        this.options = options
    }

    getOptions() {
        return this.options
    }

    async createClients() {
        this.options.forEach(async (o) => {
            this.clients.set(o.name, new MeiliSearch(o))
        })
    }

    getClient(name?: string): MeiliSearch {
        let key = 'default'
        if (!isNil(name)) key = name
        if (!this.clients.has(key)) {
            throw new Error(`client ${key} does not exist`)
        }
        return this.clients.get(key)
    }

    getClients(): Map<string, MeiliSearch> {
        return this.clients
    }
}
