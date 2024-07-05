import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { unset } from 'lodash'
import { useRef } from 'react'

import { createDict, updateDict, getDictDetail } from '@/api/dict'

import BottomButton from '@/components/bottom-button'

import DictForm from './dict-form'

export type DictModalProps = {
  onCancel: VoidFunction
  modalData: { mode: 'new' | 'edit'; id: string }
  reloadTable: VoidFunction
}

const DictModal = ({ onCancel, modalData, reloadTable }: DictModalProps) => {
  const { mode, id } = modalData || {}
  const isNew = mode === 'new'
  const formRef = useRef<ProFormInstance>()

  const getDictDetailMutation = useMutation(getDictDetail)
  const createDictMutation = useMutation(createDict)
  const updateDictMutation = useMutation(updateDict)

  const onFinishWhenNew = async (data) => {
    const form = {
      ...data,
    }
    await createDictMutation.mutateAsync(form)

    message.success('Create success', 1.5)
    onCancel()
    reloadTable?.()
  }

  const onFinishWhenEdit = async (data) => {
    const form = {
      ...data,
    }
    await updateDictMutation.mutateAsync(form)
    unset(form, 'systemFlagDisabled')
    message.success('Update success', 1.5)
    onCancel()
    reloadTable?.()
  }

  const onValuesChange = (values) => {}

  const initialValuesNew = {
    status: true,
  }

  const detailRequest = async () => {
    const res = await getDictDetailMutation.mutateAsync(id)
    return {
      ...res,
      systemFlagDisabled: Boolean(res?.systemFlag),
    }
  }

  const cleanup = () => {}

  return (
    <Modal
      width="50%"
      destroyOnClose
      title={isNew ? 'New Dict' : 'Update Dict'}
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
                loading={getDictDetailMutation.isLoading}
                onCancel={onCancel}
              />
            )
          },
        }}
        formRef={formRef}
        onValuesChange={onValuesChange}
      >
        <DictForm />
      </ProForm>
    </Modal>
  )
}

export default DictModal
