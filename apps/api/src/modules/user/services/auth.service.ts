import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import dayjs from 'dayjs'
import { FastifyRequest as Request } from 'fastify'
import { ExtractJwt } from 'passport-jwt'

import { getTime } from '@/bootstrap/utils'
import { Configure } from '@/modules/config/configure'

import { LoginStatus } from '../constants'
import { RegisterDto, UpdatePasswordDto } from '../dtos'
import { UserEntity } from '../entities/user.entity'
import { decrypt, defaultUserConfig } from '../helpers'

import { LoginLogRepository, UserRepository } from '../repositories'
import { UserConfig } from '../types'

import { LoginLogService } from './login-log.service'
import { TokenService } from './token.service'
import { UserService } from './user.service'

type LoginResponse = {
    accessToken: string
    userId: string
}

@Injectable()
export class AuthService {
    constructor(
        protected configure: Configure,
        protected userService: UserService,
        protected tokenService: TokenService,
        protected userRepository: UserRepository,
        protected loginLogService: LoginLogService,
        protected loginLogRepository: LoginLogRepository,
    ) {}

    async validateUser(credential: string, password: string) {
        const user = await this.userService.findOneByCredential(credential, async (query) =>
            query.addSelect('user.password'),
        )
        if (user && decrypt(password, user.password)) {
            return user
        }
        return false
    }

    async login(user: UserEntity, request: Request): Promise<LoginResponse> {
        const now = await getTime(this.configure)
        const { accessToken } = await this.tokenService.generateAccessToken(user, now)
        const userAgent = request.headers['user-agent']
        const remoteIp = request.headers['X-Real-IP']

        try {
            this.loginLogRepository.save({
                login_time: dayjs(now).format('YYYY-MM-DD HH:mm:ss'),
                login_ip: (remoteIp as string) ?? '127.0.0.1',
                login_device: userAgent,
                status: LoginStatus.SUCCESS,
                user,
            })
        } catch (e) {
            console.log('save login log error', e)
        }

        return {
            accessToken: accessToken.value,
            userId: user.id,
        }
    }

    async logout(req: Request) {
        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any)
        if (accessToken) {
            await this.tokenService.removeAccessToken(accessToken)
        }

        return {
            msg: 'logout_success',
        }
    }

    async createToken(id: string) {
        const now = await getTime(this.configure)
        let user: UserEntity
        try {
            user = await this.userService.detail(id)
        } catch (error) {
            throw new ForbiddenException()
        }
        const { accessToken } = await this.tokenService.generateAccessToken(user, now)
        return accessToken.value
    }

    async register(data: RegisterDto) {
        const { username, nickname, password } = data
        const user = await this.userService.create({
            username,
            nickname,
            password,
            actived: true,
        } as any)
        return this.userService.findOneByCondition({ id: user.id })
    }

    async updatePassword(user: UserEntity, { password, oldPassword }: UpdatePasswordDto) {
        const item = await this.userRepository.findOneOrFail({
            select: ['password'],
            where: { id: user.id },
        })
        if (!decrypt(oldPassword, item.password))
            throw new ForbiddenException('old password not matched')
        await this.userRepository.save({ id: user.id, password }, { reload: true })
        return this.userService.detail(user.id)
    }

    static jwtModuleFactory(configure: Configure) {
        return JwtModule.registerAsync({
            useFactory: async (): Promise<JwtModuleOptions> => {
                const config = await configure.get<UserConfig>('user', defaultUserConfig(configure))
                const option: JwtModuleOptions = {
                    secret: configure.env.get('USER_TOKEN_SECRET', 'my-access-secret'),
                    verifyOptions: {
                        ignoreExpiration: !configure.env.isProd(),
                    },
                }
                if (configure.env.isProd()) {
                    option.signOptions = { expiresIn: `${config.jwt.token_expired}s` }
                }
                return option
            },
        })
    }
}
