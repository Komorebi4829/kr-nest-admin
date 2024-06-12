import { ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Col, Form, Row, Tree } from 'antd'

import { Role } from '#/entity'

const colStyle = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  xxl: 24,
}

const ruleRequired = {
  required: true,
}

export default function RoleForm({ menuData }) {
  return (
    <>
      <ProFormText name="id" hidden />

      <Row gutter={24}>
        <Col {...colStyle}>
          <ProFormText name="name" label="Name" rules={[ruleRequired]} />
        </Col>
        <Col {...colStyle}>
          <ProFormText name="label" label="Label" rules={[ruleRequired]} />
        </Col>
        <Col {...colStyle}>
          <ProFormTextArea name="description" label="Desc" />
        </Col>
      </Row>

      {/* TODO controls */}
      <Row gutter={24}>
        <Col {...colStyle}>
          <Form.Item<Role> label="Permission" name="permission">
            <Tree
              checkable
              // checkedKeys={checkedKeys}
              treeData={menuData}
              fieldNames={{
                key: 'id',
                children: 'children',
                title: 'name',
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
