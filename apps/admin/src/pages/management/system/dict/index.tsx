import { QuestionCircleOutlined } from '@ant-design/icons'
import { ProTable, ProCard } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm, message } from 'antd'
import { omit } from 'lodash'
import { FC, useEffect, useRef, useState } from 'react'

import { useSetState } from 'react-use'

import { deleteDict, getDictList, getDictItemList, deleteDictItem } from '@/api/dict'
import { DictItemProp, DictProp } from '@/api/interface/dict'
import { IconButton, Iconify } from '@/components/icon'

import DictItemModal from './components/dict-item-modal'
import DictModal from './components/dict-modal'
import './index.css'

const List: FC = () => {
  const actionRef = useRef<ActionType>()
  const actionRef2 = useRef<ActionType>()
  const [modalData, setmodalData] = useSetState<{ mode: 'new' | 'edit'; id: string }>()
  const [dictItemModalData, setDictItemModalData] = useSetState<{
    mode: 'new' | 'edit'
    id: string
    dictId: string
  }>()
  const [dict, setdict] = useState<Record<string, any>>()

  useEffect(() => {
    reloadTable2()
  }, [dict])

  const getDictListMutation = useMutation({ mutationFn: getDictList })
  const deleteDictMutation = useMutation({ mutationFn: deleteDict })
  const getDictItemListMutation = useMutation({ mutationFn: getDictItemList })
  const deleteDictItemMutation = useMutation({ mutationFn: deleteDictItem })

  const dictColumns: ProColumns<DictProp>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 60,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      copyable: true,
      width: 100,
    },

    {
      title: 'Action',
      valueType: 'option',
      key: 'option',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => setmodalData({ mode: 'edit', id: record.id })}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title="Are you sure?" // TODO 提示它下面的字典也会删除
            okText="Yes"
            cancelText="No"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okButtonProps={{ loading: deleteDictMutation.isPending }}
            onConfirm={async () => {
              await deleteDictMutation.mutateAsync({ ids: [record.id] })
              message.success('Delete successfully', 1.5)
              if (record.id === dict.id) setdict(undefined)
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

  const dictItemColumns: ProColumns<DictItemProp>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 45,
    },
    {
      title: 'Label',
      dataIndex: 'label',
    },
    {
      title: 'Value',
      dataIndex: 'value',
    },
    {
      title: 'Order',
      dataIndex: 'sortOrder',
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    // },
    {
      title: 'Action',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton
            onClick={() => setDictItemModalData({ mode: 'edit', id: record.id, dictId: dict.id })}
          >
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okButtonProps={{ loading: deleteDictItemMutation.isPending }}
            onConfirm={async () => {
              await deleteDictItemMutation.mutateAsync({ ids: [record.id] })
              message.success('Delete successfully', 1.5)
              reloadTable2()
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

  const reloadTable2 = () => {
    actionRef2?.current?.reloadAndRest?.()
  }

  return (
    <>
      <ProCard split="vertical">
        <ProCard title="Dicts" colSpan="35%">
          <ProTable<DictProp>
            size="small"
            rowKey="id"
            search={{ filterType: 'light' }}
            pagination={{ pageSize: 10 }}
            rowClassName="dict-row"
            options={{
              fullScreen: false,
              setting: false,
              density: false,
              reload: true,
            }}
            columns={dictColumns}
            actionRef={actionRef}
            request={async (params, sort, filter) => {
              const res = await getDictListMutation.mutateAsync({
                page: params.current,
                limit: params.pageSize,
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
            onRow={(record) => {
              return {
                onDoubleClick: (event) => {
                  if (dict?.id === record?.id) {
                    reloadTable2()
                  } else {
                    setdict(record)
                  }
                },
              }
            }}
          />
        </ProCard>
        <ProCard title="Dict Items" headerBordered>
          {dict ? (
            <ProTable<DictItemProp>
              size="small"
              rowKey="id"
              search={false}
              headerTitle={dict?.name}
              pagination={{ pageSize: 10 }}
              columns={dictItemColumns}
              actionRef={actionRef2}
              request={async (params, sort, filter) => {
                const res = await getDictItemListMutation.mutateAsync({
                  dict: dict.id,
                  page: params.current,
                  limit: params.pageSize,
                  ...omit(params, ['current', 'pageSize', 'title']),
                })

                return {
                  data: res.items,
                  total: res.meta.totalItems,
                  success: true,
                }
              }}
              toolBarRender={() => [
                <Button
                  type="primary"
                  onClick={() => setDictItemModalData({ mode: 'new', dictId: dict.id })}
                >
                  New
                </Button>,
              ]}
            />
          ) : (
            'Double click dict on the left'
          )}
        </ProCard>
      </ProCard>

      <DictModal
        onCancel={() => setmodalData({ mode: null })}
        modalData={modalData}
        reloadTable={reloadTable}
      />
      <DictItemModal
        onCancel={() => setDictItemModalData({ mode: null })}
        modalData={dictItemModalData}
        reloadTable={reloadTable2}
      />
    </>
  )
}
export default List
