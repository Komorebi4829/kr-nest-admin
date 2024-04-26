import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { FC, useRef } from 'react'

import { useFetcher } from '@/components/fetcher/hooks'

export const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

export const waitTime = async (time: number = 100) => {
    await waitTimePromise(time)
}

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

const columns: ProColumns<ContentPostItem>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '标题',
        dataIndex: 'title',
        copyable: true,
        ellipsis: true,
        tooltip: '标题过长会自动收缩',
    },
    {
        title: '创建时间',
        key: 'showTime',
        dataIndex: 'createdAt',
        valueType: 'date',
        sorter: true,
        hideInSearch: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        valueType: 'dateRange',
        hideInTable: true,
        search: {
            transform: (value) => {
                return {
                    startTime: value[0],
                    endTime: value[1],
                }
            },
        },
    },
]
const List: FC = () => {
    const fetcher = useFetcher()
    const actionRef = useRef<ActionType>()

    return (
        <>
            <ProTable<ContentPostItem>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log(sort, filter)
                    // await waitTime(2000)
                    const res = (await fetcher.get('/manage/content/posts', {
                        params: {
                            page: params.current,
                            limit: params.pageSize,
                        },
                    })) as any

                    return {
                        data: res.data.items,
                        total: res.data.meta.totalItems,
                        success: true,
                    }
                }}
                rowKey="id"
                search={{}}
                pagination={{
                    pageSize: 10,
                }}
                headerTitle="Post List"
            />
            <button
                onClick={() =>
                    fetcher.post('/manage/content/posts', {
                        title: 'hello',
                        body: 'this is body',
                        category: '5881aa91-d713-4bb8-95fd-e2718ee5d990',
                    })
                }
            >
                add post
            </button>
            <button
                onClick={() =>
                    fetcher.post('/manage/content/categories', {
                        name: 'category 111',
                    })
                }
            >
                add category
            </button>
        </>
    )
}
export default List
