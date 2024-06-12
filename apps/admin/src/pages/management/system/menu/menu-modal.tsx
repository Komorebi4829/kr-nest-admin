import { ProForm } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { isNil, unset } from 'lodash'
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
  const updateMenuMutation = useMutation(menuService.updateMenu)

  useEffect(() => {}, [])

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
      hideTab: !data.hide, // reverse
      component: data.isFrame ? componentByLinkType(data._linkType) : data.component,
    }
    unset(form, '_linkType')
    await createMenuMutation.mutateAsync(form)

    message.success('Create success', 1.5)
    onCancel()
    reloadTable?.()
  }

  const onFinishWhenEdit = async (data) => {
    const form = {
      ...data,
      hide: !data.hide, // reverse
      hideTab: !data.hide, // reverse
      component: data.isFrame ? componentByLinkType(data._linkType) : data.component,
    }
    unset(form, '_linkType')
    await updateMenuMutation.mutateAsync(form)

    message.success('Update success', 1.5)
    onCancel()
    reloadTable?.()
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
    hide: false,
    hideTab: false,
    status: 1,
  }

  const detailRequest = async () => {
    const res = await getMenuDetailMutation.mutateAsync(id)
    return {
      ...res,
      hide: !res.hide,
      hideTab: !res.hideTab,
      parent: isNil(res.parent) ? 'null' : res.parent?.id,
      _linkType: res.hideTab ? LinkType.NEW_WINDOW : LinkType.EMBED,
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
                {...props}
                loading={getMenuDetailMutation.isLoading}
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
