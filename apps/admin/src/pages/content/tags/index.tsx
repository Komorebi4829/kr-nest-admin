import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm, message } from 'antd'
import { omit } from 'lodash'
import { FC, useRef } from 'react'

import { useSetState } from 'react-use'

import { getTagList, deleteTag } from '@/api/content'
import { IconButton, Iconify } from '@/components/icon'

import TagModal from './modal'

type TagItem = {
    name: string
    id: string
    description?: string
    postCount: number
}

const List: FC = () => {
    const actionRef = useRef<ActionType>()
    const [modalData, setmodalData] = useSetState<{ mode: 'new' | 'edit'; id?: string }>()

    const getTagListMutation = useMutation(getTagList)
    const deleteTagMutation = useMutation(deleteTag)

    const columns: ProColumns<TagItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'index',
            width: 48,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: 150,
            ellipsis: true,
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
                    <IconButton onClick={() => setmodalData({ mode: 'edit', id: record.id })}>
                        <Iconify icon="solar:pen-bold-duotone" size={18} />
                    </IconButton>
                    <Popconfirm
                        title="Are you sure?"
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        okButtonProps={{ loading: deleteTagMutation.isLoading }}
                        onConfirm={async () => {
                            await deleteTagMutation.mutateAsync({ ids: [record.id] })
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
            <ProTable<TagItem>
                rowKey="id"
                search={false}
                pagination={{ pageSize: 10 }}
                headerTitle="Tags"
                scroll={{ x: 'max-content' }}
                columns={columns}
                actionRef={actionRef}
                request={async (params, sort, filter) => {
                    const res = (await getTagListMutation.mutateAsync({
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
                    <Button type="primary" onClick={() => setmodalData({ mode: 'new' })}>
                        New
                    </Button>,
                ]}
            />

            <TagModal
                onCancel={() => setmodalData({ mode: null })}
                modalData={modalData}
                reloadTable={reloadTable}
            />
        </>
    )
}
export default List
