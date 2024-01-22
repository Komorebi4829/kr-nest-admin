import { Module, ModuleMetadata, Type } from '@nestjs/common'
import chalk from 'chalk'

import dayjs from 'dayjs'

import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'

import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import localeData from 'dayjs/plugin/localeData'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import deepmerge from 'deepmerge'
import { isNil } from 'lodash'

import { Configure } from '@/modules/config/configure'

import { AppConfig, PanicOption, TimeOptions } from '../types'

dayjs.extend(localeData)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(dayOfYear)

export const getRandomCharString = (length: number) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export function isAsyncFn<R, A extends Array<any>>(
    callback: (...asgs: A) => Promise<R> | R,
): callback is (...asgs: A) => Promise<R> {
    const AsyncFunction = (async () => {}).constructor
    return callback instanceof AsyncFunction === true
}

export function toBoolean(value?: string | boolean): boolean {
    if (isNil(value)) return false
    if (typeof value === 'boolean') return value
    try {
        return JSON.parse(value.toLowerCase())
    } catch (error) {
        return value as unknown as boolean
    }
}

export function toNull(value?: string | null): string | null | undefined {
    return value === 'null' ? null : value
}

export const deepMerge = <T1, T2>(
    x: Partial<T1>,
    y: Partial<T2>,
    arrayMode: 'replace' | 'merge' = 'merge',
) => {
    const options: deepmerge.Options = {}
    if (arrayMode === 'replace') {
        options.arrayMerge = (_d, s, _o) => s
    } else if (arrayMode === 'merge') {
        options.arrayMerge = (_d, s, _o) => Array.from(new Set([..._d, ...s]))
    }
    return deepmerge(x, y, options) as T2 extends T1 ? T1 : T1 & T2
}

export function CreateModule(
    target: string | Type<any>,
    metaSetter: () => ModuleMetadata = () => ({}),
): Type<any> {
    let ModuleClass: Type<any>
    if (typeof target === 'string') {
        ModuleClass = class {}
        Object.defineProperty(ModuleClass, 'name', { value: target })
    } else {
        ModuleClass = target
    }
    Module(metaSetter())(ModuleClass)
    return ModuleClass
}

export async function panic(option: PanicOption | string) {
    console.log()
    if (typeof option === 'string') {
        console.log(chalk.red(`\n❌ ${option}`))
        process.exit(1)
    }
    const { error, message, exit = true } = option
    !isNil(error) ? console.log(chalk.red(error)) : console.log(chalk.red(`\n❌ ${message}`))
    if (exit) process.exit(1)
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
