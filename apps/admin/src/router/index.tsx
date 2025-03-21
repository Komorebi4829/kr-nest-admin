import { lazy, useEffect } from 'react'
import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom'

import DashboardLayout from '@/layouts/dashboard'
import AuthGuard from '@/router/components/auth-guard'
import { usePermissionRoutes } from '@/router/hooks'
import { ErrorRoutes } from '@/router/routes/error-routes'
import { setNavigate } from '@/utils/navigator'

import { AppRouteObject } from '#/router'

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env
const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: lazy(() => import('@/pages/sys/login/Login')),
}
const PAGE_NOT_FOUND_ROUTE: AppRouteObject = {
  path: '*',
  element: <Navigate to="/404" replace />,
}

export default function Router() {
  const permissionRoutes = usePermissionRoutes()
  const asyncRoutes: AppRouteObject = {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes],
  }

  const routes = [LoginRoute, asyncRoutes, ErrorRoutes, PAGE_NOT_FOUND_ROUTE]

  const router = createHashRouter(routes as unknown as RouteObject[])

  useEffect(() => {
    // 使用 router.navigate 而不是 useNavigate hook
    setNavigate((path) => router.navigate(path))
  }, [router])

  return <RouterProvider router={router} />
}
