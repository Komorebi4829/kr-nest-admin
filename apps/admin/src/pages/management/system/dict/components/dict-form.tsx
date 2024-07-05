import {
  ProFormText,
  ProFormSwitch,
  ProFormTextArea,
  ProFormDependency,
} from '@ant-design/pro-components'
import { Col, Row } from 'antd'

const ruleRequired = {
  required: true,
}

export default function DictForm() {
  return (
    <>
      <ProFormText name="id" hidden />

      <Row gutter={24}>
        <Col span={24}>
          <ProFormText name="name" label="Name" rules={[ruleRequired]} />
        </Col>
        <Col span={24}>
          <ProFormText name="code" label="Code" rules={[ruleRequired]} />
        </Col>

        <Col span={24}>
          <ProFormTextArea name="remark" label="Remark" />
        </Col>
      </Row>

      <Row gutter={24}>
        <ProFormDependency name={['systemFlagDisabled']}>
          {({ systemFlagDisabled }) => {
            return (
              <Col span={24}>
                <ProFormSwitch
                  name="systemFlag"
                  label="System Flag"
                  tooltip="If it is a system configuration, it cannot be changed"
                  disabled={systemFlagDisabled}
                />
              </Col>
            )
          }}
        </ProFormDependency>
      </Row>
    </>
  )
}
