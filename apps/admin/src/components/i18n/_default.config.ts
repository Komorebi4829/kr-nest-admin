import { omit } from 'lodash'

import { langs } from './langs'
import { LocaleState } from './types'

export const defaultLang: LocaleState = omit(langs[0], ['antdData']) as LocaleState
