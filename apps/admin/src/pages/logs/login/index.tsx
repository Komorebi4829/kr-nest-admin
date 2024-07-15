import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Tag } from 'antd'
import { omit } from 'lodash'
import { FC, useRef } from 'react'

import { LoginLogProp } from '@/api/interface/user'
import userService from '@/api/user'

const List: FC = () => {
  const actionRef = useRef<ActionType>()

  const getLoginLogListMutation = useMutation(userService.getLoginLogList)

  const columns: ProColumns<LoginLogProp>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: 'Login User',
      dataIndex: 'user',
      width: 150,
      renderText: (_) => _.nickname,
    },
    {
      title: 'Login Time',
      dataIndex: 'login_time',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: 'Login IP',
      dataIndex: 'login_ip',
      width: 150,
    },
    {
      title: 'User Agent',
      dataIndex: 'login_device',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 80,
      render: (_, record) => {
        return record.status === 'success' ? (
          <Tag color="success">{record.status}</Tag>
        ) : (
          <Tag color="error">{record.status}</Tag>
        )
      },
    },
    {
      title: 'Fail Reason',
      dataIndex: 'fail_reason',
      width: 200,
      ellipsis: true,
    },
  ]

  return (
    <>
      <ProTable<LoginLogProp>
        rowKey="id"
        search={false}
        headerTitle="Tokens"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 888 }}
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const res = await getLoginLogListMutation.mutateAsync({
            page: params.current,
            limit: params.pageSize,
            ...omit(params, ['current', 'pageSize', 'title']),
          })

          return {
            data: res.items,
            total: res.meta.totalItems,
            success: true,
          }
        }}
      />
    </>
  )
}
export default List
