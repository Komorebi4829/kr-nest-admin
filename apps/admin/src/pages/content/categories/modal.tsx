import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { isNil } from 'lodash'
import { useRef } from 'react'

import { getCategoryDetail, updateCategory, createCategory } from '@/api/content'

import { TreeOptions } from '@/api/interface'
import { ReqCreateCategoryParams, ReqUpdateCategoryParams } from '@/api/interface/content'
import BottomButton from '@/components/bottom-button'

import CategoryForm from './form'

export type CategoryModalProps = {
  onCancel: VoidFunction
  modalData: { mode: 'new' | 'edit'; id?: string }
  reloadTable: VoidFunction
  treeData: TreeOptions[]
}

const CategoryModal = ({ onCancel, modalData, reloadTable, treeData }: CategoryModalProps) => {
  const { mode, id } = modalData || {}
  const isNew = mode === 'new'
  const formRef = useRef<ProFormInstance>()

  const getDetailMutation = useMutation({ mutationFn: getCategoryDetail })
  const createMutation = useMutation({ mutationFn: createCategory })
  const updateMutation = useMutation({ mutationFn: updateCategory })

  const onFinish = async (data: any) => {
    if (isNew) {
      await onFinishCreate(data)
    } else {
      await onFinishUpdate(data)
    }
  }

  const onFinishCreate = async (data: ReqCreateCategoryParams) => {
    const form = {
      ...data,
    }
    await createMutation.mutateAsync(form)

    message.success('Create success', 1.5)
    onCancel()
    reloadTable?.()
  }

  const onFinishUpdate = async (data: ReqUpdateCategoryParams) => {
    const form = {
      ...data,
    }
    await updateMutation.mutateAsync(form)

    message.success('Update success', 1.5)
    onCancel()
    reloadTable?.()
  }

  const onValuesChange = (values) => {}

  const initialValuesNew: Partial<any> = {}

  const detailRequest = async () => {
    const res = await getDetailMutation.mutateAsync(id)
    return {
      ...res,
      parent: isNil(res.parent) ? 'null' : res.parent?.id,
    }
  }

  const cleanup = () => {}

  return (
    <Modal
      width="50%"
      destroyOnClose
      title={isNew ? 'New Category' : 'Update Category'}
      open={!!mode}
      onCancel={() => onCancel()}
      afterClose={cleanup}
      footer={null}
      maskClosable={false}
    >
      <ProForm
        onFinish={onFinish}
        initialValues={isNew && initialValuesNew}
        request={isNew ? null : detailRequest}
        submitter={{
          render: (props, doms) => {
            return (
              <BottomButton {...props} loading={getDetailMutation.isPending} onCancel={onCancel} />
            )
          },
        }}
        formRef={formRef}
        onValuesChange={onValuesChange}
      >
        <CategoryForm treeData={treeData} />
      </ProForm>
    </Modal>
  )
}

export default CategoryModal
