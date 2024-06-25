import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Query,
    SerializeOptions,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Depends } from '@/helpers/decorators'
import { DeleteWithTrashDto } from '@/helpers/dtos'
import { PermissionAction } from '@/modules/rbac/constants'
import { Permission } from '@/modules/rbac/decorators'
import { PermissionChecker } from '@/modules/rbac/types'

import { QueryTokenDto } from '../../dtos/token.dto'
import { UserEntity } from '../../entities'
import { TokenService } from '../../services'
import { UserModule } from '../../user.module'

const permission: PermissionChecker = async (ab) => ab.can(PermissionAction.MANAGE, UserEntity.name)

@ApiTags('令牌管理')
@ApiBearerAuth()
@Depends(UserModule)
@Controller('tokens')
export class TokenController {
    constructor(protected service: TokenService) {}

    @Get()
    @Permission(permission)
    @SerializeOptions({ groups: ['token-list'] })
    async list(
        @Query()
        options: QueryTokenDto,
    ) {
        return this.service.paginate(options)
    }

    @Get(':id')
    @Permission(permission)
    @SerializeOptions({ groups: ['token-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id)
    }

    @Delete()
    @SerializeOptions({ groups: ['token-list'] })
    @Permission(permission)
    async delete(
        @Body()
        data: DeleteWithTrashDto,
    ) {
        const { ids, trash } = data
        return this.service.delete(ids, trash)
    }
}
