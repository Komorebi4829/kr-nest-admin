import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm } from 'antd'
import { unset } from 'lodash'
import { chain } from 'ramda'

import { useRef } from 'react'

import { useSetState } from 'react-use'

import menuService from '@/api/menu'
import { IconButton, Iconify } from '@/components/icon'
import { usePathname, useRouter } from '@/router/hooks'
import ProTag from '@/theme/antd/components/tag'

import MenuModal from './menu-modal'

import type { Permission } from '#/entity'

type MyMenuItem = Permission

function normalizeTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
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
    // const [menuId, setmenuId] = useState<>()
    // const [modalData, { set, setAll, remove, reset }] = useMap<{
    //     type: 'new' | 'edit'
    //     id: string
    // }>()
    const [modalData, setmodalData] = useSetState<{ type: 'new' | 'edit'; id: string }>()

    const actionRef = useRef<ActionType>()

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
                    <IconButton onClick={() => setmodalData({ type: 'edit', id: record.id })}>
                        <Iconify icon="solar:pen-bold-duotone" size={18} />
                    </IconButton>
                    <Popconfirm
                        title="Delete the Menu?"
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                        onConfirm={async () => {}}
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
                pagination={false}
                headerTitle="Menus"
                scroll={{ x: 'max-content' }}
                columns={columns}
                actionRef={actionRef}
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
                toolBarRender={() => [
                    <Button type="primary" onClick={() => setmodalData({ type: 'new' })}>
                        Add
                    </Button>,
                ]}
            />
            <MenuModal
                onCancel={() => {
                    console.log('index cancel modal')
                    setmodalData({ type: null })
                }}
                modalData={modalData}
                reloadTable={reloadTable}
            />
        </>
    )
}
