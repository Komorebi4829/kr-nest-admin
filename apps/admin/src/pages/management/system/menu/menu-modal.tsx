import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { useState, useRef, useEffect } from 'react'

import menuService from '@/api/menu'

import BottomButton from '@/components/bottom-button'

import MenuForm from './menu-form'

export type MenuModalProps = {
    onCancel: VoidFunction
    modalData: { type: 'new' | 'edit'; id: string }
    reloadTable: VoidFunction
}

const MenuModal = ({ onCancel, modalData, reloadTable }: MenuModalProps) => {
    console.log('modal data', modalData)
    const { type, id } = modalData || {}
    const isNew = type === 'new'
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [menuTree, setmenuTree] = useState([])
    const formRef = useRef<ProFormInstance>()

    const getMenuDetailMutation = useMutation(menuService.getMenuDetail)

    useEffect(
        () => {
            // if (isNew) {
            //     setInitLoading(true)
            //     requestGetMenuTree().then(() => {
            //         setInitLoading(false)
            //     })
            // } else {
            //     if (data) {
            //         setInitLoading(true)
            //         Promise.all([requestGetMenuTree(), queryMenuById({ id: record?.id })]).then(
            //             (array) => {
            //                 setDetailData(array[1])
            //                 setInitLoading(false)
            //             },
            //         )
            //     }
            // }
        },
        [
            /* data */
        ],
    )

    const onFinishWhenNew = (params) => {
        setSubmitLoading(true)
        // TODO
    }

    const onFinishWhenEdit = (params) => {
        if (params?.parentId === params?.menuId) {
            message?.error('error')
            return
        }
        setSubmitLoading(true)
        // TODO
    }

    const onValuesChange = (values) => {}

    const initialValuesNew = {}

    const detailRequest = async () => {
        const res = await getMenuDetailMutation.mutateAsync(id)
        return res
    }

    const cleanup = () => {}

    return (
        <Modal
            width="60%"
            destroyOnClose
            title={isNew ? 'New Menu' : 'Edit Menu'}
            open={!!type}
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
                    submitButtonProps: { loading: submitLoading },
                    render: (props, doms) => {
                        return <BottomButton {...props} onCancel={onCancel} />
                    },
                }}
                formRef={formRef}
                onValuesChange={onValuesChange}
            >
                <MenuForm />
            </ProForm>
        </Modal>
    )
}

export default MenuModal
