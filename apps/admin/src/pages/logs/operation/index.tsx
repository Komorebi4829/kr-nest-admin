import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Tag } from 'antd'
import { omit } from 'lodash'
import { FC, useRef } from 'react'

import { OperationLogProp } from '@/api/interface/user'
import userService from '@/api/user'
import { OperationType } from '@/utils/constants'

const List: FC = () => {
  const actionRef = useRef<ActionType>()

  const getOperationLogListMutation = useMutation(userService.getOperationLogList)

  const columns: ProColumns<OperationLogProp>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: 'Operate User',
      dataIndex: 'user',
      width: 150,
      renderText: (_) => _.nickname,
    },
    {
      title: 'Operate Time',
      dataIndex: 'operation_time',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: 'Operate Type',
      dataIndex: 'operation_type',
      valueEnum: OperationType,
      width: 100,
    },
    {
      title: 'Operate IP',
      dataIndex: 'operation_ip',
      width: 100,
    },
    {
      title: 'Operate Url',
      dataIndex: 'operation_url',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      width: 100,
    },
    {
      title: 'Execute Time',
      dataIndex: 'time',
      width: 100,
    },
    {
      title: 'User Agent',
      dataIndex: 'operation_device',
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
      <ProTable<OperationLogProp>
        rowKey="id"
        search={false}
        headerTitle="Tokens"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 888 }}
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const res = await getOperationLogListMutation.mutateAsync({
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
