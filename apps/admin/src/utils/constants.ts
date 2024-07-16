export enum PostOrderType {
  CREATED = 'createdAt',

  UPDATED = 'updatedAt',

  PUBLISHED = 'publishedAt',

  COMMENTCOUNT = 'commentCount',

  CUSTOM = 'custom',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

export enum OperationType {
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete',
  READ = 'Read',
  OTHER = 'Other',
}
