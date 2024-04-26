import bcrypt from 'bcrypt'

import { get, isNil, toNumber } from 'lodash'

import { Configure } from '../config/configure'

import { ConfigureFactory, ConfigureRegister } from '../config/types'

import { UserConfig } from './types'

export const encrypt = async (configure: Configure, password: string) => {
    const hash = (await getUserConfig<number>(configure, 'hash')) || 10
    return bcrypt.hashSync(password, hash)
}

export const decrypt = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed)
}

export const createUserConfig: (
    register: ConfigureRegister<RePartial<UserConfig>>,
) => ConfigureFactory<UserConfig> = (register) => ({
    register,
    defaultRegister: defaultUserConfig,
})

export const defaultUserConfig = (configure: Configure): UserConfig => {
    return {
        hash: 10,
        jwt: {
            token_expired: configure.env.get('USER_TOKEN_EXPIRED', (v) => toNumber(v), 3600),
            refresh_token_expired: configure.env.get(
                'USER_REFRESH_TOKEN_EXPIRED',
                (v) => toNumber(v),
                3600 * 30,
            ),
        },
    }
}

export async function getUserConfig<T>(configure: Configure, key?: string): Promise<T> {
    const userConfig = await configure.get<UserConfig>('user', defaultUserConfig(configure))
    if (isNil(key)) return userConfig as T
    return get(userConfig, key) as T
}
