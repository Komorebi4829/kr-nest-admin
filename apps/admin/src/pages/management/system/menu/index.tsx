import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Popconfirm } from 'antd'
import { chain } from 'ramda'

import menuService from '@/api/menu'
import { IconButton, Iconify } from '@/components/icon'
import { usePathname, useRouter } from '@/router/hooks'
import ProTag from '@/theme/antd/components/tag'

import type { Permission } from '#/entity'
import { useEffect, useState } from 'react'
import { unset } from 'lodash'

type MyMenuItem = Permission

function normalizeTrees<T extends { children?: T[]; }>(trees: T[] = []): T[] {
    return chain((node) => {
        const children = node.children || []
        if (!children || children.length === 0) unset(node, 'children')
        return normalizeTrees(children)
    }, trees)
}

export default function MenuPage() {
    // const { colorTextSecondary } = useThemeToken()
    const { push } = useRouter()
    const pathname = usePathname()

    const getMenuTreeMutation = useMutation(menuService.getMenuTree)

    const columns: ProColumns<MyMenuItem>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 300,
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
            width: 70,
            search: false,
        },
        {
            title: 'Path',
            dataIndex: 'path',
            search: false,
            width: 150,
            copyable: true,
            ellipsis: true,
        },
        {
            title: 'CustomOrder',
            dataIndex: 'sortOrder',
            search: false,
            width: 80,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            search: false,
            width: 80,
            valueEnum: {
                0: 'CATALOGUE',
                1: 'MENU',
                2: 'BUTTON',
            },
            render: (value, record) => {
                const d = {
                    0: 'gold',
                    1: 'blue',
                    2: 'cyan',
                }
                return <ProTag color={d[record.type] || 'default'}>{value}</ProTag>
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            search: false,
            width: 80,
            render: (value) => {
                return value === '1' ? (
                    <ProTag color="success">Enabled</ProTag>
                ) : (
                    <ProTag color="default">Disabled</ProTag>
                )
            },
        },
        {
            title: 'Permission',
            dataIndex: 'permission',
            search: false,
            width: 100,
            copyable: true,
        },
        {
            title: 'Action',
            key: 'operation',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <div className="flex w-full justify-center text-gray">
                    <IconButton
                        onClick={() => {
                            push(`${pathname}/${record.id}`)
                        }}
                    >
                        <Iconify icon="mdi:card-account-details" size={18} />
                    </IconButton>
                    <IconButton onClick={() => { }}>
                        <Iconify icon="solar:pen-bold-duotone" size={18} />
                    </IconButton>
                    <Popconfirm
                        title="Delete the User"
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

    return (
        <ProTable
            rowKey="id"
            size="small"
            search={{}}
            pagination={false}
            headerTitle="Menus"
            scroll={{ x: 'max-content' }}
            columns={columns}
            // dataSource={menus}
            request={async () => {
                const res = await getMenuTreeMutation.mutateAsync()
                normalizeTrees(res)
                return {
                    success: true,
                    data: res,
                    total: res.length,
                }
            }}
        />
    )
}
