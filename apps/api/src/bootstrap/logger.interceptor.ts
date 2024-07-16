import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest as Request } from 'fastify'
import { get } from 'lodash'

import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { EntityManager } from 'typeorm'

import { OPERATION_NAME } from '@/helpers/constants'
import { HttpMethod, OperationStatus, OperationType } from '@/modules/user/constants'

import { OperationLogEntity } from '@/modules/user/entities'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private entityManager: EntityManager,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> | Promise<Observable<any>> {
        const operationName = this.reflector.get<string>(OPERATION_NAME, context.getHandler())
        if (!operationName) return next.handle()

        const now = Date.now()
        const request = context.switchToHttp().getRequest<Request>()
        console.log(`Request to: ${request.method} ${request.url}`)
        const operationType = this.getTypeByMethod(request.method)

        const newLog = new OperationLogEntity()
        newLog.operation_name = operationName
        newLog.operation_type = operationType
        newLog.operation_time = new Date()
        newLog.operation_ip = (request.headers['X-Real-IP'] as string) ?? '127.0.0.1'
        newLog.operation_device = request.headers['user-agent']
        newLog.operation_url = request.url
        newLog.status = OperationStatus.SUCCESS
        newLog.user = (request as any).user
        newLog.method = request.method as HttpMethod

        return next.handle().pipe(
            tap(() => {
                console.log(`After... ${Date.now() - now}ms`)
                const time = Date.now() - now
                newLog.time = String(time)
                this.entityManager.save(OperationLogEntity, newLog)
            }),
        )
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
