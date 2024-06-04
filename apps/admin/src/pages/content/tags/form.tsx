import { ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Col, Row } from 'antd'

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

export default function TagForm() {
    return (
        <>
            <ProFormText name="id" hidden />

            <Row gutter={24}>
                <Col {...colStyle}>
                    <ProFormText name="name" label="Name" rules={[ruleRequired]} />
                </Col>
                <Col {...colStyle}>
                    <ProFormTextArea name="description" label="Description" />
                </Col>
            </Row>
        </>
    )
}
