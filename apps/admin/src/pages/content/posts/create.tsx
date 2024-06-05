import { ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Row, Col, Input, Button, Space } from 'antd'
import { useRef, useState } from 'react'

import { createPost, getPostDetail, getTagList, getCategoryTree } from '@/api/content'

import Editor from '@/components/editor'
import { useParams } from '@/router/hooks'

export default function CreateOrUpdatePost() {
    const [quillFull, setQuillFull] = useState('')
    const { id } = useParams()
    const formRef = useRef<ProFormInstance>()

    const createPostMutation = useMutation(createPost)
    const getPostDetailMutation = useMutation(getPostDetail)
    const getTagListMutation = useMutation(getTagList)
    const getCategoryTreeMutation = useMutation(getCategoryTree)

    const getDataReq = async () => {}
    const onValuesChange = () => {}

    return (
        <ProForm
            onFinish={null}
            initialValues={null}
            // request={getDataReq}
            submitter={{
                render: (props, doms) => {
                    return (
                        <Row justify="center">
                            <Space>
                                <Button type="default" onClick={null}>
                                    Preview
                                </Button>
                                <Button
                                    type="primary"
                                    loading={getPostDetailMutation.isLoading}
                                    onClick={null}
                                >
                                    Submit
                                </Button>
                            </Space>
                        </Row>
                    )
                },
            }}
            formRef={formRef}
            onValuesChange={onValuesChange}
        >
            <Row justify="center" gutter={[24, 24]} style={{ padding: 24 }}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Input placeholder="Title" />
                        </Col>
                        <Col span={24}>
                            <Editor
                                id="full-editor"
                                value={quillFull}
                                onChange={setQuillFull}
                                style={{ height: 400 }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <ProFormText name="name" label="Category" />
                        </Col>
                        <Col span={24}>
                            <ProFormText name="keywords" label="Keywords" />
                        </Col>
                        <Col span={24}>
                            <ProFormText name="tags" label="Tags" />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ProForm>
    )
}
