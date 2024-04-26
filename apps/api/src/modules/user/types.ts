export interface UserConfig {
    hash: number
    jwt: JwtConfig
}

export interface JwtConfig {
    token_expired: number
    refresh_token_expired: number
}

export interface JwtPayload {
    sub: string
    iat: number
}
