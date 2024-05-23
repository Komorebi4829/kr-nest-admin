import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { merge, unset } from 'lodash'
import { useRef, useEffect } from 'react'

import menuService from '@/api/menu'

import BottomButton from '@/components/bottom-button'

import MenuForm from './menu-form'

import { Permission } from '#/entity'
import { LinkType } from '#/enum'

export type MenuModalProps = {
    onCancel: VoidFunction
    modalData: { mode: 'new' | 'edit'; id: string }
    reloadTable: VoidFunction
    treeData: Permission[]
}

const MenuModal = ({ onCancel, modalData, reloadTable, treeData }: MenuModalProps) => {
    const { mode, id } = modalData || {}
    const isNew = mode === 'new'
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

    const componentByLinkType = (type: LinkType) => {
        const m = {
            [LinkType.NEW_WINDOW]: '/sys/others/iframe/external-link.tsx',
            [LinkType.EMBED]: '/sys/others/iframe/index.tsx',
        }
        return m[type]
    }

    const onFinishWhenNew = async (data) => {
        const form = {
            ...data,
            hide: !data.hide, // reverse
            component: componentByLinkType(data._linkType),
        }
        unset(form, '_linkType')
        await createMenuMutation.mutateAsync(form)

        message.success('Create success', 1.5)
        onCancel()
        reloadTable?.()
    }

    const onFinishWhenEdit = (data) => {
        // if (data?.parentId === data?.menuId) {
        //     message?.error('error')
        //     return
        // }
        const form = {
            ...data,
        }
        console.log('edit', form)
    }

    const onValuesChange = (values) => {}

    const typeOfNewMenu = () => {
        if (isNew) {
            if (id) return 1
            return 0
        }
        return null
    }

    const initialValuesNew: Partial<Permission> = {
        type: typeOfNewMenu(),
        isFrame: false,
        isCache: true,
        hide: true, // TODO reverse when submit
        status: 1,
    }

    const detailRequest = async () => {
        const res = await getMenuDetailMutation.mutateAsync(id)
        return {
            ...res,
            hide: !res.hide,
            parent: res.parent === null && 'null',
        }
    }

    const cleanup = () => {}

    return (
        <Modal
            width="80%"
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
                        return (
                            <BottomButton
                                submitButtonProps={merge(
                                    { loading: getMenuDetailMutation.isLoading },
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
                <MenuForm treeData={treeData} />
            </ProForm>
        </Modal>
    )
}

export default MenuModal
