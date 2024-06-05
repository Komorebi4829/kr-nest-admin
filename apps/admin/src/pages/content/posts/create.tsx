import { ProForm, ProFormInstance, ProFormSelect, ProFormText, ProFormTreeSelect } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Row, Col, Input, Button, Space, Form } from 'antd'
import { useRef, useState } from 'react'

import { createPost, getPostDetail, getTagList, getCategoryTree } from '@/api/content'

import Editor from '@/components/editor'
import { useParams } from '@/router/hooks'
import { chain } from 'ramda'
import { unset } from 'lodash'

export default function CreateOrUpdatePost() {
    const [quillFull, setQuillFull] = useState('')
    const { id } = useParams()
    const formRef = useRef<ProFormInstance>()

    const createPostMutation = useMutation(createPost)
    const getPostDetailMutation = useMutation(getPostDetail)
    const getTagListMutation = useMutation(getTagList)
    const getCategoryTreeMutation = useMutation(getCategoryTree)

    const getDataReq = async () => { }
    const onValuesChange = () => { }

    function normalizeTreeOptions<
        T extends {
            children?: T[]
            value?: string
            id?: string
            label?: string
            name?: string
        },
    >(trees: T[] = []): T[] {
        return chain((node) => {
            const children = node.children || []
            node.value = node.id
            node.label = node.name
            if (!children || children.length === 0) unset(node, 'children')
            return normalizeTreeOptions(children)
        }, trees)
    }

    const onFinish = async (data) => {
        console.log(data)
    }
    return (
        <ProForm
            onFinish={onFinish}
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
                                    onClick={() => props.form?.submit?.()}
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
            <ProFormText name="id" hidden />

            <Row justify="center" gutter={[24, 24]} style={{ padding: 24 }}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <Form.Item style={{ marginBottom: 0 }} required name={"title"}>
                                <Input placeholder="Title" />
                            </Form.Item>
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
                            <ProFormTreeSelect name="category" label="Category" required request={async () => {
                                const res = await getCategoryTreeMutation.mutateAsync()
                                normalizeTreeOptions(res)
                                return res
                            }} />
                        </Col>
                        <Col span={24}>
                            <ProFormText name="keywords" label="Keywords" placeholder="keyword1,keyword2,keyword3,..." />
                        </Col>
                        <Col span={24}>
                            <ProFormSelect name="tags" label="Tags" mode='multiple' request={async () => {
                                const res = await getTagListMutation.mutateAsync({
                                    page: 1,
                                    limit: 100,
                                })
                                const options = res.items.map((item) => ({ label: item.name, value: item.id }))
                                return options
                            }} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ProForm>
    )
}
