import { ProFormText } from '@ant-design/pro-components'
import { Col, Form, Row, TreeSelect } from 'antd'

import { TreeOptions } from '@/api/interface'

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

export default function CategoryForm({ treeData }: { treeData: TreeOptions[] }) {
  return (
    <>
      <ProFormText name="id" hidden />

      <Row gutter={24}>
        <Col {...colStyle}>
          <ProFormText name="name" label="Name" rules={[ruleRequired]} />
        </Col>
        <Col {...colStyle}>
          <Form.Item name="parent" label="Parent">
            <TreeSelect showSearch treeData={treeData} allowClear />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
