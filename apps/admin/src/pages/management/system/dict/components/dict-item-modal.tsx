import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { unset } from 'lodash'
import { useRef } from 'react'

import { createDictItem, updateDictItem, getDictItemDetail } from '@/api/dict'

import BottomButton from '@/components/bottom-button'

import DictItemForm from './dict-item-form'

export type DictModalProps = {
  onCancel: VoidFunction
  modalData: { mode: 'new' | 'edit'; id: string; dictId: string }
  reloadTable: VoidFunction
}

const DictModal = ({ onCancel, modalData, reloadTable }: DictModalProps) => {
  const { mode, id, dictId } = modalData || {}
  const isNew = mode === 'new'
  const formRef = useRef<ProFormInstance>()

  const getDictItemDetailMutation = useMutation({ mutationFn: getDictItemDetail })
  const createDictItemMutation = useMutation({ mutationFn: createDictItem })
  const updateDictItemMutation = useMutation({ mutationFn: updateDictItem })

  const onFinishWhenNew = async (data) => {
    const form = {
      dict: dictId,
      ...data,
    }
    unset(form, 'status')
    await createDictItemMutation.mutateAsync(form)

    message.success('Create success', 1.5)
    onCancel()
    reloadTable?.()
  }

  const onFinishWhenEdit = async (data) => {
    const form = {
      ...data,
    }
    await updateDictItemMutation.mutateAsync(form)

    message.success('Update success', 1.5)
    onCancel()
    reloadTable?.()
  }

  const onValuesChange = (values) => {}

  const initialValuesNew = {
    status: true,
  }

  const detailRequest = async () => {
    const res = await getDictItemDetailMutation.mutateAsync(id)
    return {
      ...res,
    }
  }

  const cleanup = () => {}

  return (
    <Modal
      width="50%"
      destroyOnClose
      title={isNew ? 'New Dict Item' : 'Update Dict Item'}
      open={!!mode}
      onCancel={() => onCancel()}
      afterClose={cleanup}
      footer={null}
      maskClosable={false}
    >
      <ProForm
        onFinish={isNew ? onFinishWhenNew : onFinishWhenEdit}
        initialValues={isNew && initialValuesNew}
        request={isNew ? null : detailRequest}
        submitter={{
          render: (props, doms) => {
            return (
              <BottomButton
                {...props}
                loading={getDictItemDetailMutation.isLoading}
                onCancel={onCancel}
              />
            )
          },
        }}
        formRef={formRef}
        onValuesChange={onValuesChange}
      >
        <DictItemForm />
      </ProForm>
    </Modal>
  )
}

export default DictModal
