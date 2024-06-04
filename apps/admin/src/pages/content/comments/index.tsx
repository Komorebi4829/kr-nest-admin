import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm, message } from 'antd'
import { omit } from 'lodash'
import { FC, useRef } from 'react'


import { getCommentList, deleteComment } from '@/api/content'
import { IconButton, Iconify } from '@/components/icon'

type CommentItem = {
    name: string
    id: string
    customOrder: number
    post: Record<string, any>
}

const List: FC = () => {
    const actionRef = useRef<ActionType>()

    const getCommentListMutation = useMutation(getCommentList)
    const deleteCommentMutation = useMutation(deleteComment)

    const columns: ProColumns<CommentItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'index',
            width: 48,
        },
        {
            title: 'Body',
            dataIndex: 'body',
            width: 360,
            ellipsis: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            width: 90,
            renderText: (value) => value.nickname
        },
        {
            title: 'Post',
            dataIndex: 'post',
            width: 120,
            ellipsis: true,
            render: (_, record) => {
                return record?.post?.title
            }
        },
        {
            title: 'Create Time',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            width: 150,
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
                        okButtonProps={{ loading: deleteCommentMutation.isLoading }}
                        onConfirm={async () => {
                            await deleteCommentMutation.mutateAsync({ ids: [record.id] })
                            message.success('Delete successfully', 1.5)
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
            <ProTable<CommentItem>
                rowKey="id"
                search={false}
                pagination={{ pageSize: 10 }}
                headerTitle="Comments"
                scroll={{ x: 888 }}
                columns={columns}
                actionRef={actionRef}
                request={async (params, sort, filter) => {
                    const res = (await getCommentListMutation.mutateAsync({
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
            />
        </>
    )
}
export default List
