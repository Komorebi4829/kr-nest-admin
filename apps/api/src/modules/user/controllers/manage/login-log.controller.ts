import { Controller, Get, Query, SerializeOptions } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { PermissionChecker } from '@/modules/rbac/types'

import { QueryLoginLogsDto } from '../../dtos'
import { UserEntity } from '../../entities'
import { LoginLogService } from '../../services'
import { UserModule } from '../../user.module'

const permission: PermissionChecker = async (ab) => ab.can(PermissionAction.MANAGE, UserEntity.name)

@ApiTags('登录日志')
@ApiBearerAuth()
@Depends(UserModule)
@Controller('login-log')
export class LoginLogController {
    constructor(protected service: LoginLogService) {}

    @Get()
    @Permission(permission)
    @SerializeOptions({ groups: ['login-log-list'] })
    async list(
        @Query()
        options: QueryLoginLogsDto,
    ) {
        return this.service.paginate(options)
    }
}
