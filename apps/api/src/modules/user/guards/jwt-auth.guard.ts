import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { isNil } from 'lodash'
import { ExtractJwt } from 'passport-jwt'

import { ALLOW_GUEST } from '../constants'
import { TokenService } from '../services'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        protected reflector: Reflector,
        protected tokenService: TokenService,
    ) {
        super()
    }

    async canActivate(context: ExecutionContext) {
        const allowGuest = this.reflector.getAllAndOverride<boolean>(ALLOW_GUEST, [
            context.getHandler(),
            context.getClass(),
        ])
        if (allowGuest) return true
        const request = this.getRequest(context)
        const response = this.getResponse(context)

        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
        if (isNil(requestToken)) throw new UnauthorizedException()

        const accessToken = isNil(requestToken)
            ? undefined
            : await this.tokenService.checkAccessToken(requestToken!)
        if (isNil(accessToken)) throw new UnauthorizedException()
        try {
            return (await super.canActivate(context)) as boolean
        } catch (e) {
            const token = await this.tokenService.refreshToken(accessToken, response)
            if (isNil(token)) throw new UnauthorizedException()
            if (token.accessToken) {
                request.headers.authorization = `Bearer ${token.accessToken.value}`
            }

            return (await super.canActivate(context)) as boolean
        }
    }

    handleRequest(err: any, user: any, _info: Error) {
        if (err || isNil(user)) {
            if (isNil(user)) throw new UnauthorizedException()
            throw err
        }
        return user
    }

    getRequest(context: ExecutionContext) {
        return context.switchToHttp().getRequest()
    }

    getResponse(context: ExecutionContext) {
        return context.switchToHttp().getResponse()
    }
}
