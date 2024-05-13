import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { Button, Card, Popconfirm } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { isNil } from 'ramda'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton, Iconify, SvgIcon } from '@/components/icon'
import { useUserPermission } from '@/store'
import ProTag from '@/theme/antd/components/tag'

import PermissionModal, { type PermissionModalProps } from './permission-modal'

import { Permission } from '#/entity'
import { BasicStatus, PermissionType } from '#/enum'

const defaultPermissionValue: Permission = {
    id: '',
    parentId: '',
    name: '',
    label: '',
    path: '',
    component: '',
    icon: '',
    hide: false,
    status: BasicStatus.ENABLE,
    type: PermissionType.CATALOGUE,
}

export const waitTimePromise = async (time = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

export const waitTime = async (time = 100) => {
    await waitTimePromise(time)
}

type CategoryItem = {
    isPublished?: boolean
    id: number
    // number: number;
    title: string
    // labels: {
    //   name: string;
    //   color: string;
    // }[];
    // state: string;
    // comments: number;
    // created_at: string;
    // updated_at: string;
    closed_at?: string
}

const columns222: ProColumns<CategoryItem>[] = [
    {
        dataIndex: 'index',
        valueType: 'index',
        width: 48,
    },
    {
        title: '标题',
        dataIndex: 'name',
        copyable: true,
        ellipsis: true,
        tooltip: '标题过长会自动收缩',
    },
]

export default function PermissionPage() {
    const permissions = useUserPermission()
    const { t } = useTranslation()

    const actionRef = useRef<ActionType>()

    const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps>({
        formValue: { ...defaultPermissionValue },
        title: 'New',
        show: false,
        onOk: () => {
            setPermissionModalProps((prev) => ({ ...prev, show: false }))
        },
        onCancel: () => {
            setPermissionModalProps((prev) => ({ ...prev, show: false }))
        },
    })
    const columns: ColumnsType<Permission> = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 300,
            render: (_, record) => <div>{t(record.label)}</div>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: 60,
            render: (_, record) => (
                <ProTag color="processing">{PermissionType[record.type]}</ProTag>
            ),
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
            width: 60,
            render: (icon: string) => {
                if (isNil(icon)) return ''
                if (icon.startsWith('ic')) {
                    return <SvgIcon icon={icon} size={18} className="ant-menu-item-icon" />
                }
                return <Iconify icon={icon} size={18} className="ant-menu-item-icon" />
            },
        },
        {
            title: 'Component',
            dataIndex: 'component',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
            width: 120,
            render: (status) => (
                <ProTag color={status === BasicStatus.DISABLE ? 'error' : 'success'}>
                    {status === BasicStatus.DISABLE ? 'Disable' : 'Enable'}
                </ProTag>
            ),
        },
        { title: 'Order', dataIndex: 'order', width: 60 },
        {
            title: 'Action',
            key: 'operation',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <div className="flex w-full justify-end text-gray">
                    {record?.type === PermissionType.CATALOGUE && (
                        <IconButton onClick={() => onCreate(record.id)}>
                            <Iconify icon="gridicons:add-outline" size={18} />
                        </IconButton>
                    )}
                    <IconButton onClick={() => onEdit(record)}>
                        <Iconify icon="solar:pen-bold-duotone" size={18} />
                    </IconButton>
                    <Popconfirm
                        title="Delete the Permission"
                        okText="Yes"
                        cancelText="No"
                        placement="left"
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

    const onCreate = (parentId?: string) => {
        setPermissionModalProps((prev) => ({
            ...prev,
            show: true,
            ...defaultPermissionValue,
            title: 'New',
            formValue: { ...defaultPermissionValue, parentId: parentId ?? '' },
        }))
    }

    const onEdit = (formValue: Permission) => {
        setPermissionModalProps((prev) => ({
            ...prev,
            show: true,
            title: 'Edit',
            formValue,
        }))
    }
    return (
        <Card
            title="Permission List"
            extra={
                <Button type="primary" onClick={() => onCreate()}>
                    New
                </Button>
            }
        >
            <Table
                rowKey="id"
                size="small"
                scroll={{ x: 'max-content' }}
                pagination={false}
                columns={columns}
                dataSource={permissions}
            />

            <PermissionModal {...permissionModalProps} />

            <ProTable<CategoryItem>
                columns={columns222}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    await waitTime(2000)
                    return {
                        data: [
                            {
                                id: '1',
                                name: 'tag 1',
                                // title: 'tag 1',
                                // labels: [{ name: '', color: '' }],
                            },
                            {
                                id: '2',
                                name: 'tag 2',
                                // title: 'tag 2',
                                // labels: [{ name: '', color: '' }],
                            },
                            {
                                id: '3',
                                name: 'tag 3',
                                // title: 'tag 3',
                                // labels: [{ name: '', color: '' }],
                            },
                        ],
                        total: 3,
                        success: true,
                    }
                }}
                rowKey="id"
                search={{}}
                pagination={{
                    pageSize: 10,
                }}
                headerTitle="Tags List"
            />
        </Card>
    )
}
