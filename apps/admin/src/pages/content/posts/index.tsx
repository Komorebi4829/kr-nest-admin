import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm, message } from 'antd'
import { omit } from 'lodash'
import { FC, useRef } from 'react'

import { getPostList, deletePost } from '@/api/content'
import { IconButton, Iconify } from '@/components/icon'
import { usePathname, useRouter } from '@/router/hooks'

type ContentPostItem = {
    isPublished?: boolean
    id: number
    number: number
    title: string
    labels: {
        name: string
        color: string
    }[]
    state: string
    comments: number
    created_at: string
    updated_at: string
    closed_at?: string
}

const List: FC = () => {
    const { push } = useRouter()
    const pathname = usePathname()
    const actionRef = useRef<ActionType>()

    const getPostListMutation = useMutation(getPostList)
    const deletePostMutation = useMutation(deletePost)

    const columns: ProColumns<ContentPostItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'index',
            width: 48,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            width: 80,
            renderText: (value) => value.nickname,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            width: 90,
            renderText: (value) => value?.name,
        },
        {
            title: 'Publish Time',
            dataIndex: 'publishedAt',
            valueType: 'dateTime',
            width: 150,
            hideInSearch: true,
        },
        {
            title: 'Order',
            dataIndex: 'customOrder',
            width: 70,
            hideInSearch: true,
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
                    <IconButton onClick={() => null}>
                        <Iconify icon="solar:pen-bold-duotone" size={18} />
                    </IconButton>
                    <Popconfirm
                        title="Are you sure?"
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        okButtonProps={{ loading: deletePostMutation.isLoading }}
                        onConfirm={async () => {
                            await deletePostMutation.mutateAsync({ ids: [record.id] })
                            message.success('Post deleted successfully', 1.5)
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
            <ProTable<ContentPostItem>
                rowKey="id"
                search={{}}
                pagination={{ pageSize: 8 }}
                headerTitle="Posts"
                scroll={{ x: 'max-content' }}
                columns={columns}
                actionRef={actionRef}
                request={async (params, sort, filter) => {
                    const res = (await getPostListMutation.mutateAsync({
                        page: params.current,
                        limit: params.pageSize,
                        search: params.title,
                        ...omit(params, ['current', 'pageSize', 'title']),
                    })) as any

                    return {
                        data: res.items,
                        total: res.meta.totalItems,
                        success: true,
                    }
                }}
                toolBarRender={() => [
                    <Button type="primary" onClick={() => push('/content/create-post')}>
                        New
                    </Button>,
                ]}
            />
        </>
    )
}
export default List
