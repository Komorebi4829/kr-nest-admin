import type { FormInstance } from '@ant-design/pro-components'
import { Button, Space, Row, RowProps } from 'antd'

export interface BottomButtonProps {
    loading?: boolean
    form?: FormInstance<any>
    justify?: RowProps['justify']
    onCancel?: () => void
}

const BottomButton = (props: BottomButtonProps) => {
    return (
        <Row justify={props?.justify || 'end'}>
            <Space>
                <Button
                    type="primary"
                    key="submit"
                    loading={props?.loading}
                    onClick={() => props.form?.submit?.()}
                >
                    Submit
                </Button>
                <Button type="default" key="rest" onClick={() => props?.form?.resetFields()}>
                    Reset
                </Button>
                <Button type="default" key="cancel" onClick={props?.onCancel}>
                    Cancel
                </Button>
            </Space>
        </Row>
    )
}

export default BottomButton
