import { NavigateFunction, To } from 'react-router-dom'

type RouterNavigate = (path: any, ...args: any[]) => any

let navigate: NavigateFunction | null = null

export const setNavigate = (navigateFunc: RouterNavigate): void => {
  navigate = navigateFunc
}

export const customNavigate = (to: To, options?: { replace?: boolean; state?: any }): void => {
  if (navigate) {
    navigate(to, options)
  } else {
    console.warn('Navigation function not set. Make sure to call setNavigate first.')
  }
}
