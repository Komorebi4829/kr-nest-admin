import { faker } from '@faker-js/faker'
import { useMutation } from '@tanstack/react-query'
import { App } from 'antd'
import { useNavigate } from 'react-router-dom'

import userService, { SignInReq } from '@/api/user'
import { getItem, removeItem, setItem } from '@/utils/storage'

import { createStore as create } from '../utils'

import { UserInfo, UserToken } from '#/entity'
import { StorageEnum } from '#/enum'

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env

type UserStore = {
  userInfo: Partial<UserInfo>
  userToken: UserToken
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void
    setUserToken: (token: UserToken) => void
    clearUserInfoAndToken: () => void
  }
}

const useUserStore = create<UserStore>((set) => {
  return {
    userInfo: getItem<UserInfo>(StorageEnum.User) || {},
    userToken: getItem<UserToken>(StorageEnum.Token) || {},
    actions: {
      setUserInfo: (userInfo) => {
        set({ userInfo })
        setItem(StorageEnum.User, userInfo)
      },
      setUserToken: (userToken) => {
        set({ userToken })
        setItem(StorageEnum.Token, userToken)
      },
      clearUserInfoAndToken() {
        set({ userInfo: {}, userToken: {} })
        removeItem(StorageEnum.User)
        removeItem(StorageEnum.Token)
      },
    },
  }
})

export const useUserInfo = () => useUserStore((state) => ({ ...state.userInfo }))
export const useUserToken = () => useUserStore((state) => state.userToken)
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions)
export const useUserActions = () => useUserStore((state) => state.actions)

export const useSignIn = () => {
  const navigatge = useNavigate()
  const { message } = App.useApp()
  const { setUserToken, setUserInfo } = useUserActions()

  const signInMutation = useMutation({ mutationFn: userService.signin })
  const getUserInfoMutation = useMutation({ mutationFn: userService.getUserInfo })
  const getMenuTreeMutation = useMutation({ mutationFn: userService.getMenuTree })

  const signIn = async (data: SignInReq) => {
    try {
      const res = await signInMutation.mutateAsync(data)
      const { accessToken /* refreshToken */ } = res
      setUserToken({ accessToken /* refreshToken */ })
      const user = await getUserInfoMutation.mutateAsync()
      // TODO menu-tree -> user-menu-tree
      const menuTree = await getMenuTreeMutation.mutateAsync()
      user.permissions = menuTree
      setUserInfo({ ...user, avatar: faker.image.avatarLegacy() })
      navigatge(HOMEPAGE, { replace: true })
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      })
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return signIn
}
