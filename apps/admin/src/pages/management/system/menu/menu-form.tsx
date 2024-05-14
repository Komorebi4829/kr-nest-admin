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
} from '@ant-design/pro-components'

import { Col, Row } from 'antd'

const colStyle = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 6,
}

const ruleRequired = {
    required: true,
    message: 'The item is required',
}

export default function MenuForm() {
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
                        options={[
                            { value: '0', label: '左菜单' },
                            { value: '1', label: '按钮' },
                            { value: '2', label: '顶菜单' },
                        ]}
                    />
                </Col>

                <Col {...colStyle}>
                    <ProFormText name="name" label="Name" rules={[ruleRequired]} />
                </Col>

                <Col {...colStyle}>
                    <ProFormDigit label="Order" name="customOrder" min={1} />
                </Col>
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
            </Row>
        </>
    )
}
