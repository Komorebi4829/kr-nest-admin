import { http, HttpResponse } from 'msw'

import { ORG_LIST } from '@/_mock/assets'
import { OrgApi } from '@/api/org'

const orgList = http.get(`/manage/api${OrgApi.Org}`, () => {
  return HttpResponse.json({
    status: 0,
    message: '',
    data: ORG_LIST,
  })
})

export default [orgList]
