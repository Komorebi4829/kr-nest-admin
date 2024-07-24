import { faker } from '@faker-js/faker'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import userService from '@/api/user'
import PageError from '@/pages/sys/error/PageError'
import { useUserActions, useUserToken } from '@/store'

import { useRouter } from '../hooks'

type Props = {
  children: React.ReactNode
}
export default function AuthGuard({ children }: Props) {
  const router = useRouter()
  const { accessToken } = useUserToken()
  const { setUserInfo } = useUserActions()
  const getUserInfoMutation = useMutation({ mutationFn: userService.getUserInfo })
  const getMenuTreeMutation = useMutation({ mutationFn: userService.getMenuTree })

  const check = useCallback(() => {
    if (!accessToken) {
      router.replace('/login')
      return
    }

    Promise.all([getUserInfoMutation.mutateAsync(), getMenuTreeMutation.mutateAsync()]).then(
      (arr) => {
        const [user, menuTree] = arr
        user.permissions = menuTree
        setUserInfo({ ...user, avatar: faker.image.avatarLegacy() })
      },
    )
  }, [router, accessToken])

  useEffect(() => {
    check()
  }, [])

  return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>
}
