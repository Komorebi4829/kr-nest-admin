import { SetMetadata } from '@nestjs/common'

import { OPERATION_NAME } from '../constants'

export const OperationName = (name: string) => SetMetadata(OPERATION_NAME, name)
