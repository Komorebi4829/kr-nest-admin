import { isObjectLike } from 'lodash'

import enJson from '@/locales/lang/en_US'

export function getI18nOptions() {
    return getAllKeyValues(enJson)
}

function getAllKeyValues(obj: any, prefix: string = ''): { value: string; label: any }[] {
    return Object.entries(obj).reduce((result: { value: string; label: any }[], [key, value]) => {
        const fullPath = prefix ? `${prefix}.${key}` : key
        if (isObjectLike(value)) {
            result.push(...getAllKeyValues(value, fullPath))
        } else {
            result.push({ value: fullPath, label: `${fullPath} (${value as string})` })
        }
        return result
    }, [])
}
