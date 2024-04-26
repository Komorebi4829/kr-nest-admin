import { readFileSync, writeFileSync } from 'fs'

import { ensureFileSync } from 'fs-extra'
import { has, isNil, omit, set } from 'lodash'
import YAML from 'yaml'

export class Storage {
    protected _enabled = false

    protected _path: string = undefined

    protected _config: Record<string, any> = {}

    get enabled() {
        return this._enabled
    }

    get path() {
        return this._path
    }

    get config() {
        return this._config
    }

    constructor(filePath?: string) {
        this._enabled = !isNil(filePath)
        if (filePath) {
            this._path = filePath
            ensureFileSync(this._path)
            const config = YAML.parse(readFileSync(this._path, 'utf8'))
            this._config = isNil(config) ? {} : config
        }
    }

    set<T>(key: string, value: T) {
        if (!this._enabled) {
            throw new Error('Storage needs a filePath at first')
        }
        ensureFileSync(this.path)
        set(this._config, key, value)
        writeFileSync(this.path, JSON.stringify(this._config, null, 4))
    }

    remove(key: string) {
        if (!this._enabled) {
            throw new Error('Storage needs a filePath at first')
        }
        this._config = omit(this._config, [key])
        if (has(this._config, key)) omit(this._config, [key])
        writeFileSync(this.path, JSON.stringify(this._config, null, 4))
    }
}
