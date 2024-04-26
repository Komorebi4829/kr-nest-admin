import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { FastifyRequest as Request } from 'fastify'
import { ExtractJwt } from 'passport-jwt'

import { getTime } from '@/bootstrap/utils'
import { Configure } from '@/modules/config/configure'

import { RegisterDto, UpdatePasswordDto } from '../dtos'
import { UserEntity } from '../entities/user.entity'
import { decrypt, defaultUserConfig } from '../helpers'

import { UserRepository } from '../repositories'
import { UserConfig } from '../types'

import { TokenService } from './token.service'
import { UserService } from './user.service'

@Injectable()
export class AuthService {
    constructor(
        protected configure: Configure,
        protected userService: UserService,
        protected tokenService: TokenService,
        protected userRepository: UserRepository,
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

    async login(user: UserEntity) {
        const now = await getTime(this.configure)
        const { accessToken } = await this.tokenService.generateAccessToken(user, now)
        return accessToken.value
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
