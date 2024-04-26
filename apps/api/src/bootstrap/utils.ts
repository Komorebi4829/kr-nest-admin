import crypto from 'crypto'

import dayjs from 'dayjs'

import { Configure } from '@/modules/config/configure'

import { AppConfig, TimeOptions } from './types'

export const getRandomCharString = (length: number) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(random() * charactersLength))
    }
    return result
}

export const random = () => {
    const array = new Uint32Array(1)
    const randomNum = crypto.getRandomValues(array)[0] / 0xffffffff
    return randomNum
}

export const getTime = async (configure: Configure, options?: TimeOptions) => {
    const { date, format, locale, strict, zonetime } = options ?? {}
    const config = await configure.get<AppConfig>('app')

    const now = dayjs(date, format, locale ?? config.locale, strict).clone()
    return now.tz(zonetime ?? config.timezone)
}

export const getRandomIndex = (count: number) => Math.floor(Math.random() * count)

export const getRandItemData = <T extends Record<string, any>>(list: T[]) => {
    return list[getRandomIndex(list.length)]
}

export const getRandListData = <T extends Record<string, any>>(list: T[]) => {
    const result: T[] = []
    for (let i = 0; i < getRandomIndex(list.length); i++) {
        const random = getRandItemData<T>(list)
        if (!result.find((item) => item.id === random.id)) {
            result.push(random)
        }
    }
    return result
}
