import { message as Message } from 'antd'
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'

import { t } from '@/locales/i18n'

import { getItem } from '../storage'

import { Result } from '#/api'
import { StorageEnum } from '#/enum'

type Token = {
  accessToken: string
  refreshToken: string
}

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

// 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求被发送之前做些什么
    const token = getItem<Token>(StorageEnum.Token)?.accessToken || ''
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error)
  },
)

const handle5xxError = (error: AxiosError<Result>) => {
  const { response } = error
  const errMsg = response?.data?.message || t('sys.api.apiRequestFailed')
  Message.error(errMsg)
  return Promise.reject(error)
}

const handle401Error = (error: AxiosError<Result>) => {
  const { response } = error
  const errMsg = response?.data?.message || t('sys.api.needLogin')
  Message.error(errMsg)
  return Promise.reject(error)
}

const handleOtherError = (error: AxiosError<Result>) => {
  const { response } = error
  const errMsg = response?.data?.message || t('sys.api.errorMessage')
  Message.error(errMsg)
  return Promise.reject(error)
}

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (res.status >= 200 && res.status < 300) {
      const data = res.data?.data
      return data || res.data
    }
    throw new Error(res.data?.message || t('sys.api.apiRequestFailed'))
  },
  (error: AxiosError<Result>) => {
    const { response } = error
    const statusCode = response?.status

    if (statusCode === 401) {
      return handle401Error(error)
    }
    if (statusCode >= 500) {
      return handle5xxError(error)
    }
    return handleOtherError(error)
  },
)

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }

  patch<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  }
}
export default new APIClient()
