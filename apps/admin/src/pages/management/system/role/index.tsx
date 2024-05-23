import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm, message } from 'antd'

import { useRef } from 'react'

import { useSetState } from 'react-use'

import roleService from '@/api/role'
import { IconButton, Iconify } from '@/components/icon'

import RoleModal from './role-modal'

import { Role } from '#/entity'

export default function RolePage() {
    const [modalData, setmodalData] = useSetState<{ mode: 'new' | 'edit'; id: string }>()

    const actionRef = useRef<ActionType>()

    const getRoleListMutation = useMutation(roleService.getRoleList)
    const deleteRoleTreeMutation = useMutation(roleService.deleteRole)

    const columns: ProColumns<Role>[] = [
        {
            title: 'Name',
            dataIndex: 'label',
            width: 200,
        },
        { title: 'Desc', dataIndex: 'description', search: false },
        {
            title: 'Action',
            valueType: 'option',
            key: 'option',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <div className="flex w-full justify-center text-gray">
                    <IconButton onClick={() => setmodalData({ mode: 'edit', id: record.id })}>
                        <Iconify icon="solar:pen-bold-duotone" size={18} />
                    </IconButton>
                    <Popconfirm
                        title="Delete the Role?"
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        okButtonProps={{ loading: deleteRoleTreeMutation.isLoading }}
                        onConfirm={async () => {
                            await deleteRoleTreeMutation.mutateAsync({ ids: [record.id] })
                            message.success('Role deleted successfully', 1.5)
                            reloadTable()
                        }}
                    >
                        <IconButton>
                            <Iconify
                                icon="mingcute:delete-2-fill"
                                size={18}
                                className="text-error"
                            />
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
            <ProTable
                rowKey="id"
                size="small"
                search={{}}
                pagination={{ pageSize: 10 }}
                headerTitle="Roles"
                scroll={{ x: 'max-content' }}
                columns={columns}
                actionRef={actionRef}
                request={async (params, sorter, filter) => {
                    const res = await getRoleListMutation.mutateAsync({
                        page: params.current,
                        limit: params.pageSize,
                    })
                    return {
                        success: true,
                        data: res.items,
                        total: res.meta.itemCount,
                    }
                }}
                toolBarRender={() => [
                    <Button type="primary" onClick={() => setmodalData({ mode: 'new' })}>
                        New
                    </Button>,
                ]}
            />
            <RoleModal
                onCancel={() => setmodalData({ mode: null })}
                modalData={modalData}
                reloadTable={reloadTable}
            />
        </>
    )
}
