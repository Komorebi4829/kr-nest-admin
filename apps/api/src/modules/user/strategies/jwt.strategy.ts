import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { instanceToPlain } from 'class-transformer'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { Configure } from '@/modules/config/configure'

import { UserRepository } from '../repositories/user.repository'
import { JwtPayload } from '../types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        protected configure: Configure,
        protected userRepository: UserRepository,
    ) {
        const secret = configure.env.get('USER_TOKEN_SECRET', 'my-access-secret')
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        })
    }

    async validate(payload: JwtPayload) {
        const user = await this.userRepository.findOneOrFail({ where: { id: payload.sub } })
        return instanceToPlain(user)
    }
}
