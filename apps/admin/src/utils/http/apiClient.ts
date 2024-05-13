import { message as Message } from 'antd'
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { isEmpty } from 'ramda'

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

// 响应拦截
axiosInstance.interceptors.response.use(
    (res: AxiosResponse<Result>) => {
        if (String(res.status)[0] === '2') {
            const data = res.data?.data
            if (data) return data
            return res.data
        }

        const message: string = res.data?.message
        throw new Error(message || t('sys.api.apiRequestFailed'))
    },
    (error: AxiosError<Result>) => {
        const { response, message } = error || {}
        let errMsg = ''
        try {
            errMsg = response?.data?.message || message
        } catch (error) {
            throw new Error(error as unknown as string)
        }
        // 对响应错误做点什么
        if (isEmpty(errMsg)) {
            // checkStatus
            // errMsg = checkStatus(response.data.status);
            errMsg = t('sys.api.errorMessage')
        }
        Message.error(errMsg)
        return Promise.reject(error)
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
