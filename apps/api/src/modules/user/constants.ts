/**
 * 用户列表查询排序方式
 */
export enum UserOrderType {
    CREATED = 'createdAt',
    UPDATED = 'updatedAt',
}

/**
 * 用户请求DTO验证组
 */
export enum UserValidateGroups {
    USER_CREATE = 'user-create',
    USER_UPDATE = 'user-update',
    AUTH_REGISTER = 'user-register',
    ACCOUNT_UPDATE = 'account-update',
    ACCOUNT_CHANGE_PASSWORD = 'account-change-password',
}

export const ALLOW_GUEST = 'allowGuest'

/**
 * 登录/操作结果
 */
export enum LoginStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
}

export enum OperationStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
}

/**
 * 操作日志-操作类型
 */
export enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    READ = 'read',
    OTHER = 'other',
}
