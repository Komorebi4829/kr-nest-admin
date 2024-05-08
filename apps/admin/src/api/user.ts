import apiClient from '@/utils/http/apiClient'

import { UserInfo as UserInfoEntity, UserToken } from '#/entity'

export interface SignInReq {
    credential: string
    password: string
}

export interface SignUpReq extends SignInReq {
    email: string
}
export type SignInRes = UserToken & { user: UserInfoEntity }

export enum UserApi {
    SignIn = '/api/user/account/login',
    SignUp = '/api/user/account/register',
    Logout = '/api/user/account/logout',
    Refresh = '/auth/refresh',
    UserInfo = '/api/user/account/profile',
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data })
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data })
const logout = () => apiClient.get({ url: UserApi.Logout })
const getUserInfo = () => apiClient.get<UserInfoEntity>({ url: `${UserApi.UserInfo}` })

export default {
    signin,
    signup,
    getUserInfo,
    logout,
}
