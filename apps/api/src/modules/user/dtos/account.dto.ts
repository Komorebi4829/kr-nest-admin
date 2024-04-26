import { PickType } from '@nestjs/swagger'

import { Length } from 'class-validator'

import { IsPassword } from '@/helpers/constraints'

import { DtoValidation } from '@/helpers/decorators'

import { UserValidateGroups } from '../constants'

import { UserCommonDto } from './common.dto'

@DtoValidation({
    groups: [UserValidateGroups.ACCOUNT_UPDATE],
    whitelist: false,
})
export class UpdateAccountDto extends PickType(UserCommonDto, ['username', 'nickname']) {}

@DtoValidation({
    groups: [UserValidateGroups.ACCOUNT_CHANGE_PASSWORD],
})
export class UpdatePasswordDto extends PickType(UserCommonDto, ['password', 'plainPassword']) {
    @IsPassword(5, {
        message: '密码必须由小写字母,大写字母,数字以及特殊字符组成',
        always: true,
    })
    @Length(8, 50, {
        message: '密码长度不得少于$constraint1',
        always: true,
    })
    oldPassword: string
}
