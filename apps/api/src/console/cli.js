#!/usr/bin/env node
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable import/no-extraneous-dependencies */
const { existsSync } = require('fs')
const { resolve } = require('path')

const projectPath = resolve(__dirname, '../../tsconfig.build.json')
if (existsSync(projectPath)) {
    require('ts-node').register({
        files: true,
        transpileOnly: true,
        project: projectPath,
    })
    require('tsconfig-paths/register')
    const { createOptions } = require('../appConfigs')
    const { createApp } = require('../bootstrap/app')
    const { buildCli } = require('../bootstrap/command')

    buildCli(createApp(createOptions))
}
