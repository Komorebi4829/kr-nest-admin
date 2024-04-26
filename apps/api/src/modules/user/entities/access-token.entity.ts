import { Entity, ManyToOne, OneToOne } from 'typeorm'
import type { Relation } from 'typeorm'

import { BaseToken } from './base.token'
import { RefreshTokenEntity } from './refresh-token.entity'
import { UserEntity } from './user.entity'

@Entity('user_access_tokens')
export class AccessTokenEntity extends BaseToken {
    @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.accessToken, {
        cascade: true,
    })
    refreshToken: RefreshTokenEntity

    @ManyToOne((type) => UserEntity, (user) => user.accessTokens, {
        onDelete: 'CASCADE',
    })
    user: Relation<UserEntity>
}
