import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'
import { FastifyReply as Response } from 'fastify'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

import { getTime } from '@/bootstrap/utils'
import { BaseService } from '@/helpers/BaseClass'
import { Configure } from '@/modules/config/configure'

import { AccessTokenEntity } from '../entities/access-token.entity'
import { RefreshTokenEntity } from '../entities/refresh-token.entity'
import { UserEntity } from '../entities/user.entity'
import { getUserConfig } from '../helpers'
import { AccessTokenRepository } from '../repositories/accessToken.repository'
import { JwtConfig, JwtPayload } from '../types'

@Injectable()
export class TokenService extends BaseService<AccessTokenEntity, AccessTokenRepository> {
    constructor(
        protected configure: Configure,
        protected jwtService: JwtService,
        protected repository: AccessTokenRepository,
    ) {
        super(repository)
    }

    async refreshToken(accessToken: AccessTokenEntity, response: Response) {
        const { user, refreshToken } = accessToken
        if (refreshToken) {
            const now = await getTime(this.configure)

            if (now.isAfter(refreshToken.expired_at)) return null

            const token = await this.generateAccessToken(user, now)
            await accessToken.remove()
            response.header('token', token.accessToken.value)
            return token
        }
        return null
    }

    async generateAccessToken(user: UserEntity, now: dayjs.Dayjs) {
        const config = await getUserConfig<JwtConfig>(this.configure, 'jwt')
        const accessTokenPayload: JwtPayload = {
            sub: user.id,
            iat: now.unix(),
        }

        const signed = this.jwtService.sign(accessTokenPayload)
        const accessToken = new AccessTokenEntity()
        accessToken.value = signed
        accessToken.user = user
        accessToken.expired_at = now.add(config.token_expired, 'second').toDate()
        await accessToken.save()
        const refreshToken = await this.generateRefreshToken(
            accessToken,
            await getTime(this.configure),
        )
        return { accessToken, refreshToken }
    }

    async generateRefreshToken(
        accessToken: AccessTokenEntity,
        now: dayjs.Dayjs,
    ): Promise<RefreshTokenEntity> {
        const config = await getUserConfig<JwtConfig>(this.configure, 'jwt')
        const refreshTokenPayload = {
            uuid: uuid(),
        }
        const refreshToken = new RefreshTokenEntity()
        refreshToken.value = jwt.sign(
            refreshTokenPayload,
            this.configure.env.get('USER_REFRESH_TOKEN_SECRET', 'my-refresh-secret'),
        )
        refreshToken.expired_at = now.add(config.refresh_token_expired, 'second').toDate()
        refreshToken.accessToken = accessToken
        await refreshToken.save()
        return refreshToken
    }

    async checkAccessToken(value: string) {
        return AccessTokenEntity.findOne({
            where: { value },
            relations: ['user', 'refreshToken'],
        })
    }

    async removeAccessToken(value: string) {
        const accessToken = await AccessTokenEntity.findOne({
            where: { value },
        })
        if (accessToken) await accessToken.remove()
    }

    async removeRefreshToken(value: string) {
        const refreshToken = await RefreshTokenEntity.findOne({
            where: { value },
            relations: ['accessToken'],
        })
        if (refreshToken) {
            if (refreshToken.accessToken) await refreshToken.accessToken.remove()
            await refreshToken.remove()
        }
    }

    async verifyAccessToken(token: AccessTokenEntity) {
        const result = jwt.verify(
            token.value,
            this.configure.env.get('USER_TOKEN_SECRET', 'my-access-secret'),
        )
        if (!result) return false
        return token.user
    }
}
