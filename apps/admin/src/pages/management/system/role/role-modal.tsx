import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { merge } from 'lodash'
import { useEffect, useRef, useState } from 'react'

import menuService from '@/api/menu'
import roleService from '@/api/role'

import BottomButton from '@/components/bottom-button'

import RoleForm from './role-form'

import { Permission } from '#/entity'

export type RoleModalProps = {
    onCancel: VoidFunction
    modalData: { mode: 'new' | 'edit'; id: string }
    reloadTable: VoidFunction
}

const RoleModal = ({ onCancel, modalData, reloadTable }: RoleModalProps) => {
    const { mode, id } = modalData || {}
    const isNew = mode === 'new'
    const formRef = useRef<ProFormInstance>()
    const [menuData, setmenuData] = useState<Permission[]>([])

    const getRoleDetailMutation = useMutation(roleService.getRoleDetail)
    const createRoleMutation = useMutation(roleService.createRole)
    const getMenuTreeMutation = useMutation(menuService.getMenuTree)

    useEffect(() => {
        getMenuTreeMutation.mutateAsync().then((res) => {
            setmenuData(res as Permission[])
        })

        return () => {}
    }, [])

    const onFinishWhenNew = async (data) => {
        const form = {
            ...data,
        }
        await createRoleMutation.mutateAsync(form)

        message.success('Create success', 1.5)
        onCancel()
        reloadTable?.()
    }

    const onFinishWhenEdit = (data) => {
        // if (data?.parentId === data?.roleId) {
        //     message?.error('error')
        //     return
        // }
        const form = {
            ...data,
        }
        console.log('edit', form)
    }

    const onValuesChange = (values) => {}

    const initialValuesNew: Partial<Permission> = {}

    const detailRequest = async () => {
        const res = await getRoleDetailMutation.mutateAsync(id)
        return res
    }

    const cleanup = () => {}

    return (
        <Modal
            // width="50%"
            destroyOnClose
            title={isNew ? 'New Role' : 'Edit Role'}
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
                                submitButtonProps={merge(
                                    { loading: getRoleDetailMutation.isLoading },
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
                <RoleForm menuData={menuData} />
            </ProForm>
        </Modal>
    )
}

export default RoleModal
