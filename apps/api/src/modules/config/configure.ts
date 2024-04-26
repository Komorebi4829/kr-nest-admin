import { get, has, isArray, isFunction, isNil, isObject, omit, set } from 'lodash'

import { deepMerge, isAsyncFn } from '@/utils/common'

import { Env } from './env'
import { Storage } from './storage'
import { ConfigStorageOption, ConfigureFactory, ConfigureRegister } from './types'

interface SetStorageOption {
    enabled?: boolean

    change?: boolean
}

export class Configure {
    protected inited = false

    protected factories: Record<string, ConfigureFactory<Record<string, any>>> = {}

    protected config: Record<string, any> = {}

    protected _env: Env

    protected storage: Storage

    async initialize(configs: Record<string, any> = {}, option: ConfigStorageOption = {}) {
        if (this.inited) return this
        this._env = new Env()
        await this._env.load()
        const { filePath } = option
        this.storage = new Storage(filePath)
        for (const key in configs) {
            this.add(key, configs[key])
        }
        await this.sync()
        this.inited = true
        return this
    }

    get env() {
        return this._env
    }

    all() {
        return this.config
    }

    has(key: string) {
        return has(this.config, key)
    }

    async get<T>(key: string, defaultValue?: T): Promise<T> {
        if (!has(this.config, key) && defaultValue === undefined && has(this.factories, key)) {
            await this.syncFactory(key)
            return this.get(key, defaultValue)
        }
        return get(this.config, key, defaultValue) as T
    }

    set<T>(key: string, value: T, storage: SetStorageOption | boolean = false, append = false) {
        const storageEnable = typeof storage === 'boolean' ? storage : !!storage.enabled
        const storageChange = typeof storage === 'boolean' ? false : !!storage.change
        if (storageEnable && this.storage.enabled) {
            this.changeStorageValue(key, value, storageChange, append)
        } else {
            set(this.config, key, value)
        }
        return this
    }

    add<T extends Record<string, any>>(
        key: string,
        register: ConfigureRegister<T> | ConfigureFactory<T>,
    ) {
        if (!isFunction(register) && 'register' in register) {
            this.factories[key] = register as any
        } else if (isFunction(register)) {
            this.factories[key] = { register }
        }
        return this
    }

    remove(key: string) {
        if (has(this.storage.config, key) && this.storage.enabled) {
            this.storage.remove(key)
            this.config = deepMerge(this.config, this.storage.config, 'replace')
        } else if (has(this.config, key)) {
            this.config = omit(this.config, [key])
        }
        return this
    }

    async store(key: string, change = false, append = false) {
        if (!this.storage.enabled) throw new Error('Must enable storage at first!')
        this.changeStorageValue(key, await this.get(key, null), change, append)
        return this
    }

    async sync(name?: string) {
        if (!isNil(name)) await this.syncFactory(name)
        else {
            for (const key in this.factories) {
                await this.syncFactory(key)
            }
        }
    }

    protected async syncFactory(key: string) {
        if (has(this.config, key) || !has(this.factories, key)) return this
        const { register, defaultRegister, storage, hook, append } = this.factories[key]
        let defaultValue = {}
        let value = isAsyncFn(register) ? await register(this) : register(this)
        if (!isNil(defaultRegister)) {
            defaultValue = isAsyncFn(defaultRegister)
                ? await defaultRegister(this)
                : defaultRegister(this)

            value = deepMerge(defaultValue, value, 'replace')
        }
        if (!isNil(hook)) {
            value = isAsyncFn(hook) ? await hook(this, value) : hook(this, value)
        }
        if (this.storage.enabled) {
            value = deepMerge(value, get(this.storage.config, key, isArray(value) ? [] : {}))
        }
        this.set(key, value, storage && isNil(await this.get(key, null)), append)
        return this
    }

    protected changeStorageValue<T>(key: string, value: T, change = false, append = false) {
        if (change || !has(this.storage.config, key)) {
            this.storage.set(key, value)
        } else if (isObject(get(this.storage.config, key))) {
            this.storage.set(
                key,
                deepMerge(value, get(this.storage.config, key), append ? 'merge' : 'replace'),
            )
        }
        this.config = deepMerge(this.config, this.storage.config, append ? 'merge' : 'replace')
    }
}
