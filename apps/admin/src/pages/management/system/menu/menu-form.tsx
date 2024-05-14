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
    xxl: 8,
}

const ruleRequired = {
    required: true,
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
                        rules={[ruleRequired]}
                        options={[
                            { value: 0, label: 'Catalogue' },
                            { value: 1, label: 'Menu' },
                            { value: 2, label: 'Button' },
                        ]}
                    />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="parent" label="Parent" allowClear />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="name" label="Name" rules={[ruleRequired]} />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="label" label="Label" rules={[ruleRequired]} tooltip='I18n label' placeholder='E.g. sys.menu.system.index' />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="icon" label="Icon" tooltip="local icon should start with ic" />
                </Col>
                <Col {...colStyle}>
                    <ProFormDigit name="customOrder" label="Order" min={1} />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="path" label="Path" rules={[ruleRequired]} />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="component" label="Component" rules={[ruleRequired]} placeholder='E.g. /sys/others/blank.tsx' />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="perms" label="Permission" />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="query" label="Query" />
                </Col>
                <Col {...colStyle}>
                    <ProFormSwitch
                        name="isFrame"
                        label="Is Frame"
                    />
                </Col>
                <Col {...colStyle}>
                    <ProFormText name="frameSrc" label="Frame Src" />
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
                <Col {...colStyle}>
                    {/* TODO */}
                    <ProFormSwitch
                        checkedChildren="Show"
                        unCheckedChildren="Hide"
                        name="hide"
                        label="Hide In Menu"
                    />
                </Col>
                <Col {...colStyle}>
                    <ProFormSwitch
                        checkedChildren="Show"
                        unCheckedChildren="Hide"
                        name="hideTab"
                        label="Hide Tab"
                    />
                </Col>
                <Col {...colStyle}>
                    <ProFormSwitch
                        name="isCache"
                        label="Cache"
                    />
                </Col>
                <Col {...colStyle}>
                    <ProFormSwitch
                        name="newFeature"
                        label="New Feature"
                    />
                </Col>

            </Row>
        </>
    )
}
