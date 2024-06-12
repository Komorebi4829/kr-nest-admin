import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm, message } from 'antd'
import { omit, unset } from 'lodash'
import { chain } from 'ramda'
import { FC, useEffect, useRef, useState } from 'react'

import { useSetState } from 'react-use'

import { getCategoryList, deleteCategory, getCategoryTree } from '@/api/content'
import { CategoryProp } from '@/api/interface/content'
import { IconButton, Iconify } from '@/components/icon'

import CategoryModal from './modal'

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

const List: FC = () => {
  const actionRef = useRef<ActionType>()
  const [modalData, setmodalData] = useSetState<{ mode: 'new' | 'edit'; id?: string }>()
  const [treeData, settreeData] = useState([])

  const getCategoryListMutation = useMutation(getCategoryList)
  const deleteCategoryMutation = useMutation(deleteCategory)
  const getCategoryTreeMutation = useMutation(getCategoryTree)

  useEffect(() => {
    getCategoryTreeMutation.mutateAsync().then((res) => {
      normalizeTreeOptions(res)
      settreeData([{ value: 'null', label: 'Root', children: res }] as any)
    })

    return () => {}
  }, [])

  const columns: ProColumns<CategoryProp>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Order',
      dataIndex: 'customOrder',
      width: 80,
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
            okButtonProps={{ loading: deleteCategoryMutation.isLoading }}
            onConfirm={async () => {
              await deleteCategoryMutation.mutateAsync({ ids: [record.id] })
              message.success('Post deleted successfully', 1.5)
              reloadTable()
            }}
          >
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
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
      <ProTable<CategoryProp>
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        headerTitle="Categorys"
        scroll={{ x: 'max-content' }}
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const res = await getCategoryListMutation.mutateAsync({
            page: params.current,
            limit: params.pageSize,
            search: params.title,
            ...omit(params, ['current', 'pageSize', 'title']),
          })

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

      <CategoryModal
        onCancel={() => setmodalData({ mode: null })}
        modalData={modalData}
        reloadTable={reloadTable}
        treeData={treeData}
      />
    </>
  )
}
export default List
