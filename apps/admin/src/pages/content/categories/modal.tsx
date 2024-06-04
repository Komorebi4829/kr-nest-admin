import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { isNil, merge } from 'lodash'
import { useRef, useEffect } from 'react'

import { getCategoryDetail, updateCategory, createCategory } from '@/api/content'

import BottomButton from '@/components/bottom-button'

import CategoryForm from './form'

export type CategoryModalProps = {
    onCancel: VoidFunction
    modalData: { mode: 'new' | 'edit'; id?: string }
    reloadTable: VoidFunction
}

const CategoryModal = ({ onCancel, modalData, reloadTable, treeData }: CategoryModalProps) => {
    const { mode, id } = modalData || {}
    const isNew = mode === 'new'
    const formRef = useRef<ProFormInstance>()

    const getDetailMutation = useMutation(getCategoryDetail)
    const createMutation = useMutation(createCategory)
    const updateMutation = useMutation(updateCategory)

    useEffect(() => { }, [])

    const onFinishCreate = async (data) => {
        const form = {
            ...data,
        }
        await createMutation.mutateAsync(form)

        message.success('Create success', 1.5)
        onCancel()
        reloadTable?.()
    }

    const onFinishUpdate = async (data) => {
        const form = {
            ...data,
        }
        await updateMutation.mutateAsync(form)

        message.success('Update success', 1.5)
        onCancel()
        reloadTable?.()
    }

    const onValuesChange = (values) => { }

    const initialValuesNew: Partial<any> = {}

    const detailRequest = async () => {
        const res = await getDetailMutation.mutateAsync(id)
        return {
            ...res,
            parent: isNil(res.parent) ? 'null' : res.parent?.id,
        }
    }

    const cleanup = () => { }

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
                onFinish={isNew ? onFinishCreate : onFinishUpdate}
                initialValues={isNew && initialValuesNew}
                request={isNew ? null : detailRequest}
                submitter={{
                    render: (props, doms) => {
                        return (
                            <BottomButton
                                submitButtonProps={merge(
                                    { loading: getDetailMutation.isLoading },
                                    props,
                                )}
                                onCancel={onCancel}
                            />
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
