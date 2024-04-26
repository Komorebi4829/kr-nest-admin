import { Type } from '@nestjs/common'
import { Routes } from '@nestjs/core'
import { get, pick } from 'lodash'

import { createRouteModuleTree, genRoutePath, getCleanRoutes } from '@/bootstrap/routes'
import { Configure } from '@/modules/config/configure'

import { ApiConfig, RouteOption } from '../types'

export abstract class BaseRestful {
    constructor(protected configure: Configure) {}

    protected config!: ApiConfig

    protected _routes: Routes = []

    protected _default!: string

    protected _versions: string[] = []

    protected _modules: { [key: string]: Type<any> } = {}

    get routes() {
        return this._routes
    }

    get default() {
        return this._default
    }

    get versions() {
        return this._versions
    }

    get modules() {
        return this._modules
    }

    getConfig<T>(key?: string, defaultValue?: any): T {
        return key ? get(this.config, key, defaultValue) : this.config
    }

    abstract create(_config: ApiConfig): void

    protected createConfig(config: ApiConfig) {
        if (!config.versionDefault) {
            throw new Error('default api version name should be config!')
        }
        const versionMaps = Object.entries(config.versions)

            .filter(([name]) => {
                if (config.versionDefault === name) {
                    return true
                }
                return config.enabled.includes(name)
            })

            .map(([name, version]) => {
                return [
                    name,
                    {
                        ...pick(config, ['title', 'description', 'auth']),
                        ...version,
                        tags: Array.from(
                            new Set([...(config.tags ?? []), ...(version.tags ?? [])]),
                        ),
                        routes: getCleanRoutes(version.routes ?? []),
                    },
                ]
            })

        config.versions = Object.fromEntries(versionMaps)

        this._versions = Object.keys(config.versions)

        this._default = config.versionDefault

        if (!this._versions.includes(this._default)) {
            throw new Error(`Default api version named ${this._default} not exists!`)
        }
        this.config = config
    }

    protected getRouteModules(routes: RouteOption[], parent?: string) {
        const result = routes
            .map(({ name, children }) => {
                const routeName = parent ? `${parent}.${name}` : name
                let modules: Type<any>[] = [this._modules[routeName]]
                if (children) modules = [...modules, ...this.getRouteModules(children, routeName)]
                return modules
            })
            .reduce((o, n) => [...o, ...n], [])
            .filter((i) => !!i)
        return result
    }

    protected async createRoutes() {
        const prefix = await this.configure.get<string>('app.prefix')
        const prefixManage = await this.configure.get<string>('app.prefixManage')
        const versionMaps = Object.entries(this.config.versions)

        this._routes = (
            await Promise.all(
                versionMaps.map(async ([vn, vnValue]) => {
                    const moduleTree = await createRouteModuleTree(
                        this.configure,
                        this._modules,
                        vnValue.routes ?? [],
                        vn,
                    )
                    const fixedPathModuleTree = moduleTree.map((route) => {
                        let item
                        if (route.name === 'app') {
                            item = {
                                children: route.children,
                                path: genRoutePath(route.path, prefix, vn),
                            }
                        } else if (route.name === 'manage') {
                            item = {
                                children: route.children,
                                path: genRoutePath('/', prefixManage, vn),
                            }
                        }

                        return item
                    })
                    return fixedPathModuleTree
                }),
            )
        ).reduce((o, n) => [...o, ...n], [])

        const defaultVersion = this.config.versions[this._default]
        this._routes = [
            ...this._routes,
            ...(
                await createRouteModuleTree(
                    this.configure,
                    this._modules,
                    defaultVersion.routes ?? [],
                )
            ).map((route) => {
                let item
                if (route.name === 'app') {
                    item = {
                        children: route.children,
                        path: genRoutePath(route.path, prefix),
                    }
                } else if (route.name === 'manage') {
                    item = {
                        children: route.children,
                        path: genRoutePath('/', prefixManage),
                    }
                }

                return item
            }),
        ]
    }
}
