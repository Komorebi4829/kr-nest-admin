import { SetMetadata } from '@nestjs/common'

import { PERMISSION_CHECKERS } from '../constants'
import { PermissionChecker } from '../types'

export const Permission = (...checkers: PermissionChecker[]) => {
    return SetMetadata(PERMISSION_CHECKERS, checkers)
}
