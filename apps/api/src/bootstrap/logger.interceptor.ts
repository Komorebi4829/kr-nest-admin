import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest as Request } from 'fastify'
import { get } from 'lodash'

import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { EntityManager } from 'typeorm'

import { OPERATION_NAME } from '@/helpers/constants'
import { OperationStatus, OperationType } from '@/modules/user/constants'

import { OperationLogEntity } from '@/modules/user/entities'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private entityManager: EntityManager,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> | Promise<Observable<any>> {
        const now = Date.now()
        const request = context.switchToHttp().getRequest<Request>()
        console.log(`Request to: ${request.method} ${request.url}`)
        const operationType = this.getTypeByMethod(request.method)
        const operationName =
            this.reflector.get<string>(OPERATION_NAME, context.getHandler()) || 'NOT SET'

        const newLog = new OperationLogEntity()
        newLog.operation_name = operationName
        newLog.operation_type = operationType
        newLog.operation_time = new Date()
        newLog.operation_ip = (request.headers['X-Real-IP'] as string) ?? '127.0.0.1'
        newLog.operation_device = request.headers['user-agent']
        newLog.operation_url = request.url
        newLog.status = OperationStatus.SUCCESS
        newLog.user = (request as any).user
        this.entityManager.save(OperationLogEntity, newLog)

        return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
    }

    private getTypeByMethod(method: string) {
        const typeByMethod = {
            GET: OperationType.READ,
            POST: OperationType.CREATE,
            PATCH: OperationType.UPDATE,
            PUT: OperationType.UPDATE,
            DELETE: OperationType.DELETE,
        }
        const operationType = get(typeByMethod, method, OperationType.OTHER)
        return operationType
    }
}
