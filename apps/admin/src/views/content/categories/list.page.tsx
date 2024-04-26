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

type CategoryItem = {
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

const columns: ProColumns<CategoryItem>[] = [
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
const List: FC = () => {
    const fetcher = useFetcher()
    const actionRef = useRef<ActionType>()

    return (
        <>
            <ProTable<CategoryItem>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log(sort, filter)
                    // await waitTime(2000)
                    const res = (await fetcher.get('/manage/content/categories', {
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
                headerTitle="Categories List"
            />
        </>
    )
}
export default List
