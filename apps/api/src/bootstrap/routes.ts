import { Type } from '@nestjs/common'
import { RouteTree } from '@nestjs/core'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { ApiTags } from '@nestjs/swagger'
import chalk from 'chalk'
import { trim, omit, upperFirst, camelCase, isNil } from 'lodash'

import { Restful } from '@/bootstrap/restful'
import { CONTROLLER_DEPENDS } from '@/helpers/constants'
import { APIDocOption, RouteOption } from '@/helpers/types'
import { Configure } from '@/modules/config/configure'

import { CreateModule } from './module'

/**
 * 输出API和DOC地址
 * @param factory
 */
export async function echoApi(configure: Configure, container: NestFastifyApplication) {
    const appUrl = await configure.get<string>('app.url')

    const urlPrefix = await configure.get('app.prefix', undefined)
    const apiUrl = !isNil(urlPrefix)
        ? `${appUrl}${urlPrefix.length > 0 ? `/${urlPrefix}` : urlPrefix}`
        : appUrl
    console.log(
        `√ Application is running on: ${chalk.hex('#4ade80').underline(await container.getUrl())}\n`,
    )
    console.log(`- RestAPI: ${chalk.green.underline(apiUrl)}`)
    console.log('- RestDocs:')
    const factory = container.get(Restful)
    const { default: defaultDoc, ...docs } = factory.docs
    await echoApiDocs('default', defaultDoc, appUrl)
    for (const [name, doc] of Object.entries(docs)) {
        console.log()
        echoApiDocs(name, doc, appUrl)
    }
}

/**
 * 输出一个版本的API和DOC地址
 * @param name
 * @param doc
 * @param appUrl
 */
async function echoApiDocs(name: string, doc: APIDocOption, appUrl: string) {
    const getDocPath = (dpath: string) => `${appUrl}/${dpath}`
    if (!doc.routes && doc.default) {
        console.log(
            `\t[${chalk.blueBright(name.toUpperCase())}]: ${chalk.green.underline(
                getDocPath(doc.default.path),
            )}`,
        )
        return
    }
    console.log(`    [${chalk.blueBright(name.toUpperCase())}]:`)
    if (doc.default) {
        console.log(`\t\tdefault: ${chalk.green.underline(getDocPath(doc.default.path))}`)
    }
    if (doc.routes) {
        Object.entries(doc.routes).forEach(([_routeName, rdocs]) => {
            console.log(
                `\t<${chalk.yellowBright.bold(rdocs.title)}>: ${chalk.green.underline(
                    getDocPath(rdocs.path),
                )}`,
            )
        })
    }
}

/**
 * 路由路径前缀处理
 * @param routePath
 * @param addPrefix
 */
export const trimPath = (routePath: string, addPrefix = true) =>
    `${addPrefix ? '/' : ''}${trim(routePath.replace('//', '/'), '/')}`

/**
 * 遍历路由及其子孙路由以清理路径前缀
 * @param data
 */
export const getCleanRoutes = (data: RouteOption[]): RouteOption[] =>
    data.map((option) => {
        const path = trimPath(option.path)
        const route: RouteOption = {
            ...omit(option, 'children'),
            path,
        }
        if (option.children && option.children.length > 0) {
            route.children = getCleanRoutes(option.children)
        } else {
            delete route.children
        }
        return route
    })

export const createRouteModuleTree = (
    configure: Configure,
    modules: { [key: string]: Type<any> },
    routes: RouteOption[],
    parentModule?: string,
): Promise<Array<RouteTree & { name?: string }>> => {
    return Promise.all(
        routes.map(async ({ name, path, children, controllers, doc }) => {
            const moduleName = parentModule ? `${parentModule}.${name}` : name

            if (Object.keys(modules).includes(moduleName)) {
                throw new Error('route name should be unique in same level!')
            }

            const depends = controllers
                .map((c) => Reflect.getMetadata(CONTROLLER_DEPENDS, c) || [])
                .reduce((o: Type<any>[], n) => [...o, ...n], [])
                .reduce((o: Type<any>[], n: Type<any>) => {
                    if (o.find((i) => i === n)) return o
                    return [...o, n]
                }, [])

            if (doc?.tags && doc.tags.length > 0) {
                controllers.forEach((controller) => {
                    !Reflect.getMetadata('swagger/apiUseTags', controller) &&
                        ApiTags(
                            ...doc.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name))!,
                        )(controller)
                })
            }

            const module = CreateModule(`${upperFirst(camelCase(name))}RouteModule`, () => ({
                controllers,
                imports: depends,
            }))

            modules[moduleName] = module
            const route: RouteTree & { name?: string } = { path, module, name }

            if (children)
                route.children = await createRouteModuleTree(
                    configure,
                    modules,
                    children,
                    moduleName,
                )
            return route
        }),
    )
}

/**
 * 生成最终路由路径(为路由路径添加自定义及版本前缀)
 * @param routePath
 * @param prefix
 * @param version
 */
export const genRoutePath = (routePath: string, prefix?: string, version?: string) => {
    const addVersion = `${version ? `/${version.toLowerCase()}/` : '/'}${routePath}`
    return isNil(prefix) ? trimPath(addVersion) : trimPath(`${prefix}${addVersion}`)
}

/**
 * 生成最终文档路径
 * @param routePath
 * @param prefix
 * @param version
 */
export const genDocPath = (routePath: string, prefix?: string, version?: string) =>
    trimPath(`${prefix}${version ? `/${version.toLowerCase()}/` : '/'}${routePath}`, false)
