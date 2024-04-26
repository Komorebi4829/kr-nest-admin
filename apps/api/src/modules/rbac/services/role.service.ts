import { Injectable } from '@nestjs/common'

import { BaseService } from '@/helpers/BaseClass'

import { RoleEntity } from '../entities'
import { PermissionRepository, RoleRepository } from '../repositories'

@Injectable()
export class RoleService extends BaseService<RoleEntity, RoleRepository> {
    protected enable_trash = true

    constructor(
        protected roleRepository: RoleRepository,
        protected permissionRepository: PermissionRepository,
    ) {
        super(roleRepository)
    }
}
