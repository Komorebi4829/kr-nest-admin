import { Config } from 'meilisearch'

export type MelliConfig = MelliOption[]

export type MelliOption = Config & { name: string }
