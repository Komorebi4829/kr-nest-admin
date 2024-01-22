import { ModuleMetadata, PipeTransform, Type } from '@nestjs/common'

import { IAuthGuard } from '@nestjs/passport'
import { NestFastifyApplication } from '@nestjs/platform-fastify'

import dayjs from 'dayjs'
import { Ora } from 'ora'
import { StartOptions } from 'pm2'
import { CommandModule } from 'yargs'

import { Configure } from '../config/configure'
import { ConfigStorageOption } from '../config/types'

export type App = {
    container?: NestFastifyApplication
    configure: Configure
    commands: CommandModule<RecordAny, RecordAny>[]
}

export interface AppConfig {
    name: string

    host: string

    port: number

    https: boolean

    timezone: string

    locale: string

    fallbackLocale: string

    url?: string

    prefix?: string

    pm2?: Omit<StartOptions, 'name' | 'cwd' | 'script' | 'args' | 'interpreter' | 'watch'>
}

export interface ContainerBuilder {
    (params: { configure: Configure; BootModule: Type<any> }): Promise<NestFastifyApplication>
}

export interface CreateOptions {
    modules: (configure: Configure) => Promise<Required<ModuleMetadata['imports']>>

    commands: () => CommandCollection

    builder: ContainerBuilder

    globals?: {
        pipe?: (configure: Configure) => PipeTransform<any> | null

        interceptor?: Type<any> | null

        filter?: Type<any> | null

        guard?: Type<IAuthGuard>
    }

    config: {
        factories: Record<string, any>

        storage: ConfigStorageOption
    }
}

export interface PanicOption {
    message?: string

    spinner?: Ora

    error?: any

    exit?: boolean
}

export type CommandCollection = Array<CommandItem<any, any>>

export type CommandItem<T = Record<string, any>, U = Record<string, any>> = (
    app: Required<App>,
) => Promise<CommandOption<T, U>>

export interface CommandOption<T = RecordAny, U = RecordAny> extends CommandModule<T, U> {
    instant?: boolean
}

export interface TimeOptions {
    date?: dayjs.ConfigType

    format?: dayjs.OptionType

    locale?: string

    strict?: boolean

    zonetime?: string
}
