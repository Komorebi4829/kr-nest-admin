import { ProCard } from '@ant-design/pro-components'
import { Col, Row, Descriptions } from 'antd'

export default function AboutPage() {
  const { pkg, lastBuildTime } = __APP_INFO__

  const { dependencies, devDependencies, version } = pkg

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <ProCard title="About" bordered>
          <a href="https://github.com/Komorebi4829/kr-nest-admin">kr-nest-admin</a> 的前端项目是基于
          React18、Vite、Ant Design、Ant Design Pro、TypeScript 开发，
          内置了动态路由、权限验证、并提供了常用的功能组件，帮助你快速搭建企业级中后台产品原型。
        </ProCard>
      </Col>
      <Col span={24}>
        <ProCard title="Info" bordered>
          <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
            <Descriptions.Item label="版本">{version}</Descriptions.Item>
            <Descriptions.Item label="最后编译时间">{lastBuildTime}</Descriptions.Item>
            <Descriptions.Item label="GitHub">
              <a href="https://github.com/Komorebi4829/kr-nest-admin">Github</a>
            </Descriptions.Item>
            <Descriptions.Item label="预览地址">
              <a href="https://kentriversnook.com/showcase/kr-nest-admin">Preview</a>
            </Descriptions.Item>
          </Descriptions>
        </ProCard>
      </Col>
      <Col span={24}>
        <ProCard title="Dependencies" bordered>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
            bordered
            size="small"
          >
            {Object.keys(dependencies).map((key) => (
              <Descriptions.Item key={key} label={key}>
                {dependencies[key]}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </ProCard>
      </Col>
      <Col span={24}>
        <ProCard title="Dev Dependencies" bordered>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
            bordered
            size="small"
          >
            {Object.keys(devDependencies).map((key) => (
              <Descriptions.Item key={key} label={key}>
                {devDependencies[key]}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </ProCard>
      </Col>
    </Row>
  )
}
