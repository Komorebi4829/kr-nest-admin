import { Controller, Get, Query, SerializeOptions } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { PermissionChecker } from '@/modules/rbac/types'

import { QueryOperationLogsDto } from '../../dtos'
import { UserEntity } from '../../entities'
import { OperationLogService } from '../../services'
import { UserModule } from '../../user.module'

const permission: PermissionChecker = async (ab) => ab.can(PermissionAction.MANAGE, UserEntity.name)

@ApiTags('操作日志')
@ApiBearerAuth()
@Depends(UserModule)
@Controller('operation-log')
export class OperationLogController {
    constructor(protected service: OperationLogService) {}

    @Get()
    @Permission(permission)
    @SerializeOptions({ groups: ['operation-log-list'] })
    async list(
        @Query()
        options: QueryOperationLogsDto,
    ) {
        return this.service.paginate(options)
    }
}
