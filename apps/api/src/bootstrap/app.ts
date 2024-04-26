// eslint-disable-next-line
import '@/utils/dayjs-init'

import { BadGatewayException, Global, Logger, Module, ModuleMetadata, Type } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import chalk from 'chalk'
import { useContainer } from 'class-validator'
import { isNil, omit } from 'lodash'

import { AppFilter, AppIntercepter, AppPipe } from '@/helpers/providers'
import { ConfigModule } from '@/modules/config/config.module'
import { Configure } from '@/modules/config/configure'
import { ConfigureFactory, ConfigureRegister } from '@/modules/config/types'

import { createCommands } from './command'
import { getDefaultAppConfig } from './defaultConfig'
import { CreateModule } from './module'
import { echoApi } from './routes'
import { App, AppConfig, CreateOptions, PanicOption } from './types'

const logger = new Logger('Bootstrap')

export const app: App = {
    configure: new Configure(),
    commands: [],
    container: undefined,
}

export const createApp = (options: CreateOptions) => async (): Promise<App> => {
    const { config, builder } = options
    await app.configure.initialize(config.factories, config.storage)
    if (!app.configure.has('app')) {
        throw new BadGatewayException('App config not exists!')
    }
    const BootModule = await createBootModule(app.configure, options)
    app.container = await builder({
        configure: app.configure,
        BootModule,
    })
    // if (app.configure.has('app.prefix')) {
    //     app.container.setGlobalPrefix(await app.configure.get<string>('app.prefix'))
    // }
    useContainer(app.container.select(BootModule), {
        fallbackOnErrors: true,
    })
    app.commands = await createCommands(options.commands, app as Required<App>)
    return app
}

export async function createBootModule(
    configure: Configure,
    options: Pick<CreateOptions, 'globals' | 'modules'>,
): Promise<Type<any>> {
    const { globals = {} } = options

    const modules = await options.modules(configure)
    const imports: ModuleMetadata['imports'] = (
        await Promise.all([
            ...modules,
            ConfigModule.forRoot(configure),
            // await CoreModule.forRoot(configure),
        ])
    ).map((item) => {
        if ('module' in item) {
            // console.log(`createBootModule: ${item.module.name}`)
            const meta = omit(item, ['module', 'global'])
            Module(meta)(item.module)
            if (item.global) Global()(item.module)
            return item.module
        }
        return item
    })

    const providers: ModuleMetadata['providers'] = []
    if (globals.pipe !== null) {
        const pipe = globals.pipe
            ? globals.pipe(configure)
            : new AppPipe({
                  transform: true,
                  whitelist: true,
                  forbidNonWhitelisted: true,
                  forbidUnknownValues: true,
                  validationError: { target: false },
              })
        providers.push({
            provide: APP_PIPE,
            useValue: pipe,
        })
    }
    if (globals.interceptor !== null) {
        providers.push({
            provide: APP_INTERCEPTOR,
            useClass: globals.interceptor ?? AppIntercepter,
        })
    }
    if (globals.filter !== null) {
        providers.push({
            provide: APP_FILTER,
            useClass: AppFilter,
        })
    }

    if (!isNil(globals.guard)) {
        providers.push({
            provide: APP_GUARD,
            useClass: globals.guard,
        })
    }

    return CreateModule('BootModule', () => {
        const meta: ModuleMetadata = {
            imports,
            providers,
        }
        return meta
    })
}

export const createAppConfig: (
    register: ConfigureRegister<RePartial<AppConfig>>,
) => ConfigureFactory<AppConfig> = (register) => ({
    register,
    defaultRegister: (configure) => getDefaultAppConfig(configure),
    hook: (configure: Configure, value) => {
        if (isNil(value.url))
            value.url = `${value.https ? 'https' : 'http'}://${value.host}:${value.port}`
        return value
    },
})

export async function startApp(
    creator: () => Promise<App>,
    listened?: (app: App, startTime: Date) => () => Promise<void>,
) {
    const startTime = new Date()
    const { container, configure, commands } = await creator()
    app.commands = commands
    app.container = container
    app.configure = configure
    const { port, host } = await configure.get<AppConfig>('app')
    await container.listen(port, host, listened(app, startTime))
}

export const listened: (app: App, startTime: Date) => () => Promise<void> = (
    { configure, container },
    startTime,
) => {
    return async () => {
        console.log()
        await echoApi(configure, container)
        console.log(
            'used time:',
            chalk.cyanBright(`${new Date().getTime() - startTime.getTime()}ms`),
        )
        logger.warn(`used time: ${new Date().getTime() - startTime.getTime()}ms`)
    }
}

export async function panic(option: PanicOption | string) {
    console.log()
    if (typeof option === 'string') {
        console.log(chalk.red(`\n❌ ${option}`))
        process.exit(1)
    }
    const { error, message, spinner, exit = true } = option
    if (!isNil(error)) {
        !isNil(spinner) ? spinner.fail(chalk.red(error)) : console.log(chalk.red(error))
    } else {
        !isNil(spinner)
            ? spinner.succeed(chalk.red(`\n❌ ${message}`))
            : console.log(chalk.red(`\n❌ ${message}`))
    }

    if (exit) process.exit(1)
}
