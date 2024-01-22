/* eslint-disable import/no-extraneous-dependencies */

import { StartOptions } from 'pm2'

export type Pm2Arguments = {
    entry?: string

    watch?: boolean

    restart?: boolean

    args?: string[]
}

export type Pm2Option = Pick<Pm2Arguments, 'watch' | 'args'> &
    Omit<StartOptions, 'name' | 'cwd' | 'script' | 'args' | 'interpreter' | 'watch'>
