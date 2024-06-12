import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { chain } from 'ramda'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

const traverseTree = <
    T extends {
        label: string
        id: string
        children?: T[]
        title?: string
        name?: string
        value?: string
    },
>(
    trees: T[] = [],
    t: any,
): T[] => {
    return chain((node) => {
        node.title = t(node.label)
        node.name = t(node.label)
        node.value = node.id
        return traverseTree(node.children, t)
    }, trees)
}

const RoleModal = ({ onCancel, modalData, reloadTable }: RoleModalProps) => {
    const { t } = useTranslation()
    const { mode, id } = modalData || {}
    const isNew = mode === 'new'
    const formRef = useRef<ProFormInstance>()
    const [menuData, setmenuData] = useState<Permission[]>([])

    const getRoleDetailMutation = useMutation(roleService.getRoleDetail)
    const createRoleMutation = useMutation(roleService.createRole)
    const updateRoleMutation = useMutation(roleService.updateRole)
    const getMenuTreeMutation = useMutation(menuService.getMenuTree)

    useEffect(() => {
        if (!mode) return () => {}
        getMenuTreeMutation.mutateAsync().then((res) => {
            traverseTree(res as Permission[], t)
            setmenuData(res as Permission[])
        })

        return () => {}
    }, [mode])

    const onFinishWhenNew = async (data) => {
        const form = {
            ...data,
        }
        await createRoleMutation.mutateAsync(form)

        message.success('Create successfully', 1.5)
        onCancel()
        reloadTable?.()
    }

    const onFinishWhenUpdate = async (data) => {
        const form = {
            ...data,
        }
        await updateRoleMutation.mutateAsync(form)

        message.success('Update successfully', 1.5)
        onCancel()
        reloadTable?.()
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
            destroyOnClose
            title={isNew ? 'New Role' : 'Update Role'}
            open={!!mode}
            onCancel={() => onCancel()}
            afterClose={cleanup}
            footer={null}
            maskClosable={false}
        >
            <ProForm
                onFinish={isNew ? onFinishWhenNew : onFinishWhenUpdate}
                initialValues={isNew && initialValuesNew}
                request={isNew ? null : detailRequest}
                submitter={{
                    render: (props, doms) => {
                        return (
                            <BottomButton
                                {...props}
                                loading={getRoleDetailMutation.isLoading}
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
