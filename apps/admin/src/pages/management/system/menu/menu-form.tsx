import {
  ProFormText,
  // ProFormDateRangePicker,
  // ProFormSelect,
  // ProFormTextArea,
  // ProFormUploadButton,
  ProFormSwitch,
  ProFormDigit,
  // ProFormCheckbox,
  ProFormRadio,
  ProFormDependency,
  ProFormSelect,
} from '@ant-design/pro-components'
import { Form, TreeSelect, Col, Row } from 'antd'

import { useMemo } from 'react'

import IconSelect from '@/components/icon-select'
import { getNamesFromPages } from '@/router/utils'

import { getI18nOptions } from '@/utils/i18n-options'

import type { Permission } from '#/entity'

import { LinkType, PermissionType } from '#/enum'

const colStyle = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 8,
}

const ruleRequired = {
  required: true,
}

export default function MenuForm({
  treeData,
}: Permission & {
  children?: Permission[]
  value?: string
  id?: string
  label?: string
  name?: string
}) {
  const pageNames = useMemo(() => getNamesFromPages(), [])
  const i18nOptions = useMemo(() => getI18nOptions(), [])
  return (
    <>
      <ProFormText name="id" hidden />

      <Row gutter={24}>
        <Col {...colStyle}>
          <ProFormRadio.Group
            name="type"
            label="Type"
            radioType="button"
            fieldProps={{ buttonStyle: 'solid' }}
            rules={[ruleRequired]}
            options={[
              { value: 0, label: 'Catalogue' },
              { value: 1, label: 'Menu' },
              { value: 2, label: 'Button' },
            ]}
          />
        </Col>
        <Col {...colStyle}>
          <Form.Item name="parent" label="Parent">
            <TreeSelect showSearch treeData={treeData} allowClear placeholder="Please select" />
          </Form.Item>
        </Col>
        <Col {...colStyle}>
          <ProFormText name="name" label="Name" rules={[ruleRequired]} />
        </Col>
        <Col {...colStyle}>
          <ProFormSelect
            name="label"
            label="Label"
            rules={[ruleRequired]}
            tooltip="I18n label"
            placeholder="E.g. sys.menu.system.index"
            options={i18nOptions}
            fieldProps={{ showSearch: true }}
          />
        </Col>
        <Col {...colStyle}>
          <Form.Item name="icon" label="Icon">
            <IconSelect />
          </Form.Item>
        </Col>
        <Col {...colStyle}>
          <ProFormDigit name="customOrder" label="Order" min={1} />
        </Col>
        <Col {...colStyle}>
          <ProFormText name="path" label="Path" rules={[ruleRequired]} />
        </Col>

        <ProFormDependency name={['type', 'isFrame']}>
          {({ type, isFrame }) => {
            if (type === PermissionType.MENU && !isFrame) {
              return (
                <Col {...colStyle}>
                  <ProFormSelect
                    name="component"
                    label="Component"
                    rules={type === PermissionType.MENU && [ruleRequired]}
                    options={pageNames}
                  />
                </Col>
              )
            }
            return null
          }}
        </ProFormDependency>
        <Col {...colStyle}>
          <ProFormText name="perms" label="Permission" />
        </Col>
        <Col {...colStyle}>
          <ProFormText name="query" label="Query" />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col {...colStyle}>
          <ProFormSwitch name="isFrame" label="Is External Link?" />
        </Col>

        <ProFormDependency name={['isFrame']}>
          {({ isFrame }) => {
            if (isFrame) {
              return (
                <>
                  <Col {...colStyle}>
                    <ProFormRadio.Group
                      name="_linkType"
                      label="Link Type"
                      radioType="button"
                      fieldProps={{ buttonStyle: 'solid' }}
                      rules={[ruleRequired]}
                      initialValue={LinkType.NEW_WINDOW}
                      options={[
                        { value: LinkType.NEW_WINDOW, label: 'New Window' },
                        { value: LinkType.EMBED, label: 'Embed' },
                      ]}
                    />
                  </Col>
                  <Col {...colStyle}>
                    <ProFormText name="frameSrc" label="Link URL" rules={[ruleRequired]} />
                  </Col>
                </>
              )
            }
            return null
          }}
        </ProFormDependency>
      </Row>

      <Row gutter={24}>
        <Col {...colStyle}>
          <ProFormSwitch
            checkedChildren="Enable"
            unCheckedChildren="Disable"
            name="status"
            label="Status"
          />
        </Col>
        <Col {...colStyle}>
          <ProFormSwitch
            checkedChildren="Show"
            unCheckedChildren="Hide"
            name="hide"
            label="Show In Menu"
          />
        </Col>
        <Col {...colStyle}>
          <ProFormSwitch
            checkedChildren="Show"
            unCheckedChildren="Hide"
            name="hideTab"
            label="Show Tab"
          />
        </Col>
        <Col {...colStyle}>
          <ProFormSwitch name="isCache" label="Cache" />
        </Col>
        <Col {...colStyle}>
          <ProFormSwitch name="newFeature" label="New Feature" />
        </Col>
      </Row>
    </>
  )
}
