import { createOptions } from './appConfigs'
import { startApp, createApp, listened } from './bootstrap/app'

startApp(createApp(createOptions), listened)
