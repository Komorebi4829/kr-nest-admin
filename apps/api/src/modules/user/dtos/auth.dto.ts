import { PickType } from '@nestjs/swagger'

import { DtoValidation } from '@/helpers/decorators'

import { UserValidateGroups } from '../constants'

import { UserCommonDto } from './common.dto'

export class CredentialDto extends PickType(UserCommonDto, ['credential', 'password']) {}

@DtoValidation({ groups: [UserValidateGroups.AUTH_REGISTER] })
export class RegisterDto extends PickType(UserCommonDto, [
    'username',
    'nickname',
    'password',
    'plainPassword',
] as const) {}
