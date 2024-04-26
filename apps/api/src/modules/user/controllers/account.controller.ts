import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Request,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { pick } from 'lodash'

import { Depends } from '@/helpers/decorators'

import { Guest, ReqUser } from '../decorators'
import { CredentialDto, RegisterDto, UpdateAccountDto, UpdatePasswordDto } from '../dtos'
import { UserEntity } from '../entities'
import { LocalAuthGuard } from '../guards'
import { AuthService, UserService } from '../services'
import { UserIdInterceptor } from '../user.interceptor'
import { UserModule } from '../user.module'

@ApiTags('账户操作')
@ApiBearerAuth()
@Depends(UserModule)
@Controller('account')
export class AccountController {
    constructor(
        protected authService: AuthService,
        protected userService: UserService,
    ) {}

    @Post('register')
    @Guest()
    async register(
        @Body()
        data: RegisterDto,
    ) {
        return this.authService.register(data)
    }

    @Post('login')
    @Guest()
    @UseGuards(LocalAuthGuard)
    async login(@ReqUser() user: ClassToPlain<UserEntity>, @Body() _data: CredentialDto) {
        return { token: await this.authService.createToken(user.id) }
    }

    @Post('logout')
    @ApiBearerAuth()
    async logout(@Request() req: any) {
        return this.authService.logout(req)
    }

    @Get('profile')
    @ApiBearerAuth()
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async profile(@ReqUser() user: ClassToPlain<UserEntity>) {
        return this.userService.detail(user.id)
    }

    @Patch()
    @ApiBearerAuth()
    @SerializeOptions({
        groups: ['user-detail'],
    })
    @UseInterceptors(UserIdInterceptor)
    async update(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body()
        data: UpdateAccountDto,
    ) {
        return this.userService.update({ id: user.id, ...pick(data, ['username', 'nickname']) })
    }

    @Patch('reset-passowrd')
    @ApiBearerAuth()
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async resetPassword(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: UpdatePasswordDto,
    ) {
        return this.authService.updatePassword(user, data)
    }
}
