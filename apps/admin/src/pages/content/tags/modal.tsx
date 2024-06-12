import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { useRef } from 'react'

import { getTagDetail, updateTag, createTag } from '@/api/content'

import { ReqCreateTagParams, ReqUpdateTagParams } from '@/api/interface/content'
import BottomButton from '@/components/bottom-button'

import TagForm from './form'

export type TagModalProps = {
    onCancel: VoidFunction
    modalData: { mode: 'new' | 'edit'; id?: string }
    reloadTable: VoidFunction
}

const TagModal = ({ onCancel, modalData, reloadTable }: TagModalProps) => {
    const { mode, id } = modalData || {}
    const isNew = mode === 'new'
    const formRef = useRef<ProFormInstance>()

    const getDetailMutation = useMutation(getTagDetail)
    const createMutation = useMutation(createTag)
    const updateMutation = useMutation(updateTag)

    const onFinish = async (data: any) => {
        if (isNew) {
            await onFinishCreate(data)
        } else {
            await onFinishUpdate(data)
        }
    }

    const onFinishCreate = async (data: ReqCreateTagParams) => {
        const form = {
            ...data,
        }
        await createMutation.mutateAsync(form)

        message.success('Create success', 1.5)
        onCancel()
        reloadTable?.()
    }

    const onFinishUpdate = async (data: ReqUpdateTagParams) => {
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
        }
    }

    const cleanup = () => {}

    return (
        <Modal
            width="50%"
            destroyOnClose
            title={isNew ? 'New Tag' : 'Update Tag'}
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
                            <BottomButton
                                {...props}
                                loading={getDetailMutation.isLoading}
                                onCancel={onCancel}
                            />
                        )
                    },
                }}
                formRef={formRef}
                onValuesChange={onValuesChange}
            >
                <TagForm />
            </ProForm>
        </Modal>
    )
}

export default TagModal
