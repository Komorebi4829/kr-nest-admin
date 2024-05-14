import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { useState, useRef, useEffect, useMemo } from 'react'

import menuService from '@/api/menu'

import BottomButton from '@/components/bottom-button'

import MenuForm from './menu-form'
import { merge } from 'lodash'
import { Permission } from '#/entity'

export type MenuModalProps = {
    onCancel: VoidFunction
    modalData: { mode: 'new' | 'edit'; id: string }
    reloadTable: VoidFunction
}

const MenuModal = ({ onCancel, modalData, reloadTable }: MenuModalProps) => {
    console.log('modal data', modalData)
    const { mode, id } = modalData || {}
    const isNew = mode === 'new'
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [menuTree, setmenuTree] = useState([])
    const formRef = useRef<ProFormInstance>()

    const getMenuDetailMutation = useMutation(menuService.getMenuDetail)
    const createMenuMutation = useMutation(menuService.createMenu)

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

    const onFinishWhenNew = async (data) => {
        setSubmitLoading(true)
        const form = {
            ...data,
            hide: !data.hide, // reverse
        }
        try {
            await createMenuMutation.mutateAsync(form)
        } finally {
            setSubmitLoading(false)
        }
        
        message.success('Success!', 1.5)
        setTimeout(() => {
            onCancel()
            reloadTable?.()
        }, 1500);

    }

    const onFinishWhenEdit = (data) => {
        if (data?.parentId === data?.menuId) {
            message?.error('error')
            return
        }
        setSubmitLoading(true)
        // TODO
    }

    const onValuesChange = (values) => { }

    const typeOfNewMenu = () => {
        if (isNew) {
            if (id) return 1
            else return 0
        }
        return null
    }

    const initialValuesNew: Partial<Permission> = {
        type: typeOfNewMenu(),
        isFrame: false,
        isCache: true,
        hide: true,  // TODO reverse when submit
        status: 1,
    }

    const detailRequest = async () => {
        const res = await getMenuDetailMutation.mutateAsync(id)
        return res
    }

    const cleanup = () => {
        setSubmitLoading(false)
    }

    return (
        <Modal
            width="60%"
            destroyOnClose
            title={isNew ? 'New Menu' : 'Edit Menu'}
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
                        return <BottomButton submitButtonProps={merge({ loading: submitLoading }, props)} onCancel={onCancel} />
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
