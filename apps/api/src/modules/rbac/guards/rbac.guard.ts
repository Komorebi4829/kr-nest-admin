import { createMongoAbility } from '@casl/ability'
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'

import { ModuleRef, Reflector } from '@nestjs/core'

import { isNil } from 'lodash'

import { JwtAuthGuard } from '@/modules/user/guards'
import { UserRepository } from '@/modules/user/repositories'
import { TokenService } from '@/modules/user/services'

import { PERMISSION_CHECKERS } from '../constants'
import { PermissionEntity } from '../entities'
import { RbacBootstrap } from '../rbac.bootstrap'
import { CheckerParams, PermissionChecker } from '../types'

@Injectable()
export class RbacGuard extends JwtAuthGuard {
    constructor(
        protected reflector: Reflector,
        protected rbacBootstrap: RbacBootstrap,
        protected tokenService: TokenService,
        protected userRepository: UserRepository,
        protected moduleRef: ModuleRef,
    ) {
        super(reflector, tokenService)
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authCheck = await super.canActivate(context)
        if (!authCheck) throw new ForbiddenException()

        const checkers = this.reflector.getAllAndOverride<PermissionChecker[]>(
            PERMISSION_CHECKERS,
            [context.getHandler(), context.getClass()],
        )
        if (isNil(checkers) || checkers.length <= 0) return true

        const result = await checkPermissions({
            resolver: this.rbacBootstrap,
            repository: this.userRepository,
            checkers,
            moduleRef: this.moduleRef,
            request: context.switchToHttp().getRequest(),
        })
        if (!result) {
            throw new ForbiddenException()
        }

        return true
    }
}

export const checkPermissions = async ({
    checkers,
    moduleRef,
    resolver,
    repository,
    request,
}: CheckerParams) => {
    if (isNil(request.user)) return false

    const user = await repository.findOneOrFail({
        relations: ['roles.permissions', 'permissions'],
        where: {
            id: request.user.id,
        },
    })
    let permissions = user.permissions as PermissionEntity[]
    for (const role of user.roles) {
        permissions = [...permissions, ...role.permissions]
    }
    permissions = permissions.reduce((o, n) => {
        if (o.find(({ name }) => name === n.name)) return o
        return [...o, n]
    }, [])

    const ability = createMongoAbility(
        permissions.map(({ rule, name }) => {
            const resolve = resolver.permissions.find((it) => it.name === name)
            if (!isNil(resolve) && !isNil(resolve.rule.conditions)) {
                return { ...rule, conditions: resolve.rule.conditions(user) }
            }
            return rule
        }),
    )

    const results = await Promise.all(
        checkers.map(async (checker) => checker(ability, moduleRef, request)),
    )

    return results.every((it) => !!it)
}
