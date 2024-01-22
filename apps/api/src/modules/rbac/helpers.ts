import { MongoAbility } from '@casl/ability'
import { ApiOperation } from '@nestjs/swagger'
import { FastifyRequest as Request } from 'fastify'
import { isArray, isNil } from 'lodash'
import { ObjectLiteral } from 'typeorm'

import { CrudMethodOption } from '../restful/types'

import { PermissionAction } from './constants'
import { ManualPermission } from './decorators/permission.decorator'
import { PermissionChecker } from './types'

/**
 * 获取请求中的items,item,id,用于crud操作时验证数据
 * @param key
 * @param request
 */
export const getRequestData = (key?: string, request?: Request): string[] => {
    const { params = {}, body = {} } = (request ?? {}) as any
    if (!isNil(key)) {
        const requestValue = params[key] ?? body[key]
        if (isNil(requestValue)) return []
        return isArray(requestValue) ? requestValue : [requestValue]
    }
    const id = params.id ?? body.id ?? params.item ?? body.item
    const { items } = body
    if (!isNil(id)) return [id]
    return !isNil(items) && isArray(items) ? items : []
}

/**
 * 验证是否是数据拥有者
 * @param ability
 * @param options
 */
export const checkOwnerPermission = async <E extends ObjectLiteral>(
    ability: MongoAbility,
    options: {
        request: Request
        key?: string
        getData: (items: string[]) => Promise<E[]>
        permission?: string
    },
) => {
    const { request, key, getData, permission } = options
    const models = await getData(getRequestData(key, request))
    return models.every((model) => ability.can(permission ?? PermissionAction.OWNER, model))
}

/**
 * 快速生成常用CRUD装饰器选项
 * @param permissions
 * @param apiSummary
 */
export const simpleCurdOption = (
    permissions?: PermissionChecker[],
    apiSummary?: string,
): CrudMethodOption => ({
    hook: (target, method) => {
        if (permissions) ManualPermission(target, method, permissions)
        if (apiSummary) {
            ApiOperation({ summary: apiSummary })(
                target,
                method,
                Object.getOwnPropertyDescriptor(target.prototype, method),
            )
        }
    },
})
