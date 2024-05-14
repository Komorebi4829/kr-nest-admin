import type { SubmitterProps } from '@ant-design/pro-components'
import { Button, Space, Row, ButtonProps } from 'antd'

export type BottomButtonProps = {
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    submitButtonProps: SubmitterProps & ButtonProps
    form: {
        submit: () => void
        reset: () => void
        resetFields: () => void
    }
    onCancel: VoidFunction
}

const BottomButton = (props: BottomButtonProps) => {
    return (
        <Row justify={props?.justify}>
            <Space>
                <Button
                    type="primary"
                    key="submit"
                    loading={props?.submitButtonProps?.loading}
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
