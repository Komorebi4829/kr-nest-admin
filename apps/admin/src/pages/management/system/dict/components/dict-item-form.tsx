import {
  ProFormText,
  ProFormSwitch,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-components'
import { Col, Row } from 'antd'

const ruleRequired = {
  required: true,
}

export default function DictItemForm() {
  return (
    <>
      <ProFormText name="id" hidden />

      <Row gutter={24}>
        <Col span={24}>
          <ProFormText name="label" label="Label" rules={[ruleRequired]} />
        </Col>
        <Col span={24}>
          <ProFormText name="value" label="Value" rules={[ruleRequired]} />
        </Col>
        <Col span={24}>
          <ProFormTextArea name="description" label="Description" />
        </Col>
        <Col span={24}>
          <ProFormTextArea name="remark" label="Remark" />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <ProFormDigit name="sortOrder" label="Order" min={1} />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <ProFormSwitch name="status" label="Status" />
        </Col>
      </Row>
    </>
  )
}
