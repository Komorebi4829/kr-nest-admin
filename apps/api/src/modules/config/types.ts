import { Configure } from './configure'

export interface ConfigStorageOption {
    filePath?: string
}

export type ConfigureRegister<T extends Record<string, any>> = (
    configure: Configure,
) => T | Promise<T>

export interface ConfigureFactory<
    T extends Record<string, any>,
    C extends Record<string, any> = T,
> {
    register: ConfigureRegister<RePartial<T>>

    defaultRegister?: ConfigureRegister<T>

    storage?: boolean

    hook?: (configure: Configure, value: T) => C | Promise<C>

    append?: boolean
}

export type ConnectionOption<T extends Record<string, any>> = { name?: string } & T

export type ConnectionRst<T extends Record<string, any>> = Array<{ name: string } & T>
