import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { faker } from '@faker-js/faker'
import { useMutation } from '@tanstack/react-query'
import { Popconfirm, message } from 'antd'
import { omit } from 'lodash'
import { useRef } from 'react'

import { UserProp } from '@/api/interface/user'
import { deleteUser, getUserList } from '@/api/user'
import { IconButton, Iconify } from '@/components/icon'
import ProTag from '@/theme/antd/components/tag'
import { useThemeToken } from '@/theme/hooks'

export default function UserList() {
  const { colorTextSecondary } = useThemeToken()
  const actionRef = useRef<ActionType>()

  const getUserListMutation = useMutation({ mutationFn: getUserList })
  const deleteUserMutation = useMutation({ mutationFn: deleteUser })

  const columns: ProColumns<UserProp>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 300,
      render: (_, record) => {
        return (
          <div className="flex">
            <img alt="" src={faker.image.avatar()} className="h-10 w-10 rounded-full" />
            <div className="ml-2 flex flex-col">
              <span className="text-sm">{record.username}</span>
              <span style={{ color: colorTextSecondary }} className="text-xs">
                {record.email}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
      width: 120,
      render: (_, record) =>
        record.roles?.map((role) => (
          <ProTag color="cyan" key={role.id}>
            {role.label}
          </ProTag>
        )),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: () => <ProTag color="success">Enable</ProTag>,
    },
    {
      title: 'Action',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <Popconfirm
            title="Delete the User"
            okText="Yes"
            cancelText="No"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okButtonProps={{ loading: deleteUserMutation.isPending }}
            onConfirm={async () => {
              await deleteUserMutation.mutateAsync({ ids: [record.id] })
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
      <ProTable<UserProp>
        rowKey="id"
        search={false}
        headerTitle="Users"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const res = await getUserListMutation.mutateAsync({
            page: params.current,
            limit: params.pageSize,
            orderBy: 'updatedAt',
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
