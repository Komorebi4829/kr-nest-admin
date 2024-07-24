import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Popconfirm, message } from 'antd'
import { omit } from 'lodash'
import { FC, useRef } from 'react'

import { TokenProp } from '@/api/interface/token'
import { deleteToken, getTokenList } from '@/api/token'
import { IconButton, Iconify } from '@/components/icon'

const List: FC = () => {
  const actionRef = useRef<ActionType>()

  const getTokenListMutation = useMutation({ mutationFn: getTokenList })
  const deleteTokenMutation = useMutation({ mutationFn: deleteToken })

  const columns: ProColumns<TokenProp>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: 'Token Type',
      width: 80,
      render: () => 'Bearer',
    },
    {
      title: 'Access Token',
      dataIndex: 'value',
      width: 180,
      copyable: true,
      ellipsis: true,
    },
    {
      title: 'Expire Time',
      dataIndex: 'expired_at',
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: 'Refresh Token',
      dataIndex: 'refreshToken',
      width: 180,
      copyable: true,
      ellipsis: true,
      renderText(_) {
        return _.value
      },
    },
    {
      title: 'Action',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Popconfirm
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okButtonProps={{ loading: deleteTokenMutation.isPending }}
            onConfirm={async () => {
              await deleteTokenMutation.mutateAsync({ ids: [record.id] })
              message.success('Delete successfully', 1.5)
              reloadTable()
            }}
          >
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ]

  const reloadTable = () => {
    actionRef?.current?.reloadAndRest?.()
  }

  return (
    <>
      <ProTable<TokenProp>
        rowKey="id"
        search={false}
        headerTitle="Tokens"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 888 }}
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const res = await getTokenListMutation.mutateAsync({
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
