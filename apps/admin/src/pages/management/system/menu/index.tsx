import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm, message } from 'antd'
import { cloneDeep, isNil, unset } from 'lodash'

import { chain } from 'ramda'

import { useRef, useState } from 'react'

import { useSetState } from 'react-use'

import menuService from '@/api/menu'
import { IconButton, Iconify, SvgIcon } from '@/components/icon'
import { usePathname, useRouter } from '@/router/hooks'
import ProTag from '@/theme/antd/components/tag'

import MenuModal from './menu-modal'

import type { Permission } from '#/entity'
import { BasicStatus, PermissionType } from '#/enum'

type MyMenuItem = Permission

function normalizeTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
    return chain((node) => {
        const children = node.children || []
        if (!children || children.length === 0) unset(node, 'children')
        return normalizeTrees(children)
    }, trees)
}

function normalizeTreeOptions<
    T extends {
        children?: T[]
        value?: string
        id?: string
        label?: string
        name?: string
    },
>(trees: T[] = []): T[] {
    return chain((node) => {
        const children = node.children || []
        node.value = node.id
        node.label = node.name
        if (!children || children.length === 0) unset(node, 'children')
        return normalizeTreeOptions(children)
    }, trees)
}

export default function MenuPage() {
    // const { colorTextSecondary } = useThemeToken()
    const { push } = useRouter()
    const pathname = usePathname()
    const [modalData, setmodalData] = useSetState<{ mode: 'new' | 'edit'; id: string }>()
    const [treeData, settreeData] = useState<Permission[]>([])

    const actionRef = useRef<ActionType>()

    const getMenuTreeMutation = useMutation(menuService.getMenuTree)
    const deleteMenuTreeMutation = useMutation(menuService.deleteMenu)

    const columns: ProColumns<MyMenuItem>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
            width: 70,
            search: false,
            render: (icon: string) => {
                if (isNil(icon)) return null
                if (icon.startsWith('ic')) {
                    return <SvgIcon icon={icon} size={18} className="ant-menu-item-icon" />
                }
                return <Iconify icon={icon} size={18} className="ant-menu-item-icon" />
            },
        },
        { title: 'Order', dataIndex: 'customOrder', width: 60, search: false },
        {
            title: 'Path',
            dataIndex: 'path',
            search: false,
            width: 100,
            ellipsis: true,
        },
        {
            title: 'Permission',
            dataIndex: 'permission',
            search: false,
            width: 100,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            search: false,
            width: 80,
            valueEnum: PermissionType,
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
            render: (status) => (
                <ProTag color={status === BasicStatus.DISABLE ? 'error' : 'success'}>
                    {status === BasicStatus.DISABLE ? 'Disable' : 'Enable'}
                </ProTag>
            ),
        },

        {
            title: 'Action',
            valueType: 'option',
            key: 'option',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <div className="flex w-full justify-center text-gray">
                    {record?.type === PermissionType.CATALOGUE && (
                        <IconButton onClick={() => setmodalData({ mode: 'new', id: record.id })}>
                            <Iconify icon="gridicons:add-outline" size={18} />
                        </IconButton>
                    )}
                    <IconButton onClick={() => setmodalData({ mode: 'edit', id: record.id })}>
                        <Iconify icon="solar:pen-bold-duotone" size={18} />
                    </IconButton>
                    <Popconfirm
                        title="Delete the menu?"
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        okButtonProps={{ loading: deleteMenuTreeMutation.isLoading }}
                        onConfirm={async () => {
                            await deleteMenuTreeMutation.mutateAsync({ ids: [record.id] })
                            message.success('Menu deleted successfully', 1.5)
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
                pagination={false}
                headerTitle="Menus"
                scroll={{ x: 'max-content' }}
                columns={columns}
                actionRef={actionRef}
                request={async () => {
                    const res = await getMenuTreeMutation.mutateAsync()
                    normalizeTrees(res as Permission[])
                    const copyRes = cloneDeep(res)
                    normalizeTreeOptions(copyRes as Permission[])
                    settreeData([{ value: 'null', label: 'Root Menu', children: copyRes }] as any)
                    return {
                        success: true,
                        data: res,
                        total: res.length,
                    }
                }}
                toolBarRender={() => [
                    <Button type="primary" onClick={() => setmodalData({ mode: 'new' })}>
                        New
                    </Button>,
                ]}
            />
            <MenuModal
                onCancel={() => setmodalData({ mode: null })}
                modalData={modalData}
                reloadTable={reloadTable}
                treeData={treeData}
            />
        </>
    )
}
