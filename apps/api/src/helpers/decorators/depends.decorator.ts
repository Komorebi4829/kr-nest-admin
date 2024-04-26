import { SetMetadata, Type } from '@nestjs/common'

import { CONTROLLER_DEPENDS } from '@/helpers/constants'

export const Depends = (...depends: Type<any>[]) => SetMetadata(CONTROLLER_DEPENDS, depends ?? [])
