import type { FormInstance, SubmitterProps } from '@ant-design/pro-components'
import { Button, Space, Row } from 'antd'

export type BottomButtonProps = {
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    submitButtonProps: SubmitterProps & {
        form?: FormInstance<any>
    } & {
        submit: () => void
        reset: () => void
    } & {
        loading: boolean
    }
    onCancel: VoidFunction
}

const BottomButton = (props: BottomButtonProps) => {
    return (
        <Row justify={props?.justify || 'end'}>
            <Space>
                <Button
                    type="primary"
                    key="submit"
                    loading={props?.submitButtonProps?.loading}
                    onClick={() => props.submitButtonProps?.form?.submit?.()}
                >
                    Submit
                </Button>
                <Button
                    type="default"
                    key="rest"
                    onClick={() => props?.submitButtonProps?.form?.resetFields()}
                >
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
