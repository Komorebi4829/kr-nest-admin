import { DtoValidation } from '@/helpers/decorators'
import { PaginateDto } from '@/helpers/dtos'

@DtoValidation({ type: 'query' })
export class QueryTokenDto extends PaginateDto {}
