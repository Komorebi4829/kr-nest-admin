import {
    ProForm,
    ProFormInstance,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
} from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Row, Col, Input, Button, Space, Form, message } from 'antd'
import { unset } from 'lodash'
import { chain } from 'ramda'
import { useContext, useRef } from 'react'

import { createPost, updatePost, getPostDetail, getTagList, getCategoryTree } from '@/api/content'

import Editor from '@/components/editor'
import { TabsContext } from '@/layouts/dashboard/multi-tabs'
import { useParams } from '@/router/hooks'

import { template } from './preview'

export default function CreateOrUpdatePost() {
    const { id } = useParams()
    const { closeTab } = useContext(TabsContext)

    const formRef = useRef<ProFormInstance>()

    const createPostMutation = useMutation(createPost)
    const updatePostMutation = useMutation(updatePost)
    const getPostDetailMutation = useMutation(getPostDetail)
    const getTagListMutation = useMutation(getTagList)
    const getCategoryTreeMutation = useMutation(getCategoryTree)

    const getDataReq = async () => {
        const res = await getPostDetailMutation.mutateAsync(id)
        return {
            ...res,
            category: res.category?.id,
            tags: res.tags?.map((tag) => tag.id),
            keywords: res.keywords?.join(','),
        }
    }

    const onValuesChange = () => {}

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

    const onFinishCreate = async (data) => {
        const form = {
            ...data,
            keywords: data.keywords?.trim().split(','),
        }
        await createPostMutation.mutateAsync(form)
        message.success('Post created successfully')
        setTimeout(() => {
            closeTab()
        }, 1500)
    }

    const onFinishUpdate = async (data) => {
        const form = {
            ...data,
            keywords: data.keywords?.trim().split(','),
        }
        await updatePostMutation.mutateAsync(form)
        message.success('Post updated successfully')
        setTimeout(() => {
            closeTab()
        }, 1500)
    }

    const preview = (content: string) => {
        if ((window as any).previewWindow) {
            ;(window as any).previewWindow.close()
        }

        ;(window as any).previewWindow = window.open()
        ;(window as any).previewWindow.document.write(template(content))
        ;(window as any).previewWindow.document.close()
    }

    return (
        <ProForm
            onFinish={id ? onFinishUpdate : onFinishCreate}
            initialValues={null}
            request={id && getDataReq}
            submitter={{
                render: (props, doms) => {
                    return (
                        <Row justify="center">
                            <Space>
                                <Button
                                    type="default"
                                    onClick={() => {
                                        const body = props.form.getFieldValue('body')
                                        console.log('preview', body)
                                        preview(body)
                                    }}
                                >
                                    Preview
                                </Button>
                                <Button
                                    type="primary"
                                    loading={createPostMutation.isLoading}
                                    onClick={() => props.submit()}
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
                            <Form.Item
                                name="title"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, max: 255 }]}
                            >
                                <Input placeholder="Title" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="body"
                                rules={[
                                    {
                                        message: 'Please enter post content',
                                        required: true,
                                        validator: (_, value) => {
                                            if (
                                                !value ||
                                                value === '<p></p>' ||
                                                value === '<p><br></p>'
                                            ) {
                                                return Promise.reject()
                                            }
                                            return Promise.resolve()
                                        },
                                    },
                                ]}
                            >
                                <Editor id={`full-editor-${id}`} style={{ height: 400 }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <ProFormTreeSelect
                                name="category"
                                label="Category"
                                rules={[{ required: true }]}
                                request={async () => {
                                    const res = await getCategoryTreeMutation.mutateAsync()
                                    normalizeTreeOptions(res)
                                    return res
                                }}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormText
                                name="keywords"
                                label="Keywords"
                                placeholder="keyword1,keyword2,keyword3,..."
                                rules={[
                                    {
                                        message: 'Each keyword should not exceed 20 characters',
                                        validator: (_, value: string) => {
                                            const arr = value.split(',')
                                            for (let i = 0; i < arr.length; i++) {
                                                if (arr[i].length > 20) {
                                                    return Promise.reject()
                                                }
                                            }
                                            return Promise.resolve()
                                        },
                                    },
                                ]}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormSelect
                                name="tags"
                                label="Tags"
                                mode="multiple"
                                request={async () => {
                                    const res = await getTagListMutation.mutateAsync({
                                        page: 1,
                                        limit: 100,
                                    })
                                    const options = res.items.map((item) => ({
                                        label: item.name,
                                        value: item.id,
                                    }))
                                    return options
                                }}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea
                                name="summary"
                                label="Summary"
                                fieldProps={{ maxLength: 500 }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ProForm>
    )
}
