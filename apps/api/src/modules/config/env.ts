import { readFileSync } from 'fs'

import { parse } from 'dotenv'
import findUp from 'find-up'
import { isFunction, isNil } from 'lodash'

import { EnvironmentType } from './constants'

export class Env {
    async load() {
        if (isNil(process.env.NODE_ENV)) process.env.NODE_ENV = EnvironmentType.DEVELOPMENT
        const search = [findUp.sync(['.env'])]
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (this.isDev()) {
            search.push(
                findUp.sync([`.env.${EnvironmentType.DEVELOPMENT}`, `.env.${EnvironmentType.DEV}`]),
            )
        } else if (this.isProd()) {
            search.push(
                findUp.sync([`.env.${EnvironmentType.PRODUCTION}`, `.env.${EnvironmentType.PROD}`]),
            )
        } else {
            search.push(findUp.sync([`.env.${this.run()}`]))
        }
        const envFiles = search.filter((file) => file !== undefined) as string[]
        const fileEnvs = envFiles
            .map((filePath) => parse(readFileSync(filePath)))
            .reduce(
                (oc, nc) => ({
                    ...oc,
                    ...nc,
                }),
                {},
            )
        const envs = { ...process.env, ...fileEnvs }
        const keys = Object.keys(envs).filter((key) => !(key in process.env))
        keys.forEach((key) => {
            process.env[key] = envs[key]
        })
    }

    run() {
        return process.env.NODE_ENV as EnvironmentType & RecordAny
    }

    isProd() {
        return this.run() === EnvironmentType.PRODUCTION || this.run() === EnvironmentType.PROD
    }

    isDev() {
        return this.run() === EnvironmentType.DEVELOPMENT || this.run() === EnvironmentType.DEV
    }

    get(): { [key: string]: string }
    get<T extends BaseType = string>(key: string): T
    get<T extends BaseType = string>(key: string, parseTo: ParseType<T>): T
    get<T extends BaseType = string>(key: string, defaultValue: T): T
    get<T extends BaseType = string>(key: string, parseTo: ParseType<T>, defaultValue: T): T
    get<T extends BaseType = string>(key?: string, parseTo?: ParseType<T> | T, defaultValue?: T) {
        if (!key) return process.env
        const value = process.env[key]
        if (value !== undefined) {
            if (parseTo && isFunction(parseTo)) {
                return parseTo(value)
            }
            return value as T
        }
        if (parseTo === undefined && defaultValue === undefined) {
            return undefined
        }
        if (parseTo && defaultValue === undefined) {
            return isFunction(parseTo) ? undefined : parseTo
        }
        return defaultValue! as T
    }
}
