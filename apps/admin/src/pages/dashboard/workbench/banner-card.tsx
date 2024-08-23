import { Col, Row } from 'antd'
import Color from 'color'

import { useUserInfo } from '@/store'
import { useThemeToken } from '@/theme/hooks'

import BannerSvg from './banner'

export default function BannerCard() {
  const { username } = useUserInfo()
  const themeToken = useThemeToken()

  const bg = `linear-gradient(135deg, ${Color(themeToken.colorPrimaryHover).alpha(0.2)}, ${Color(
    themeToken.colorPrimary,
  ).alpha(0.2)}) rgb(255, 255, 255)`

  return (
    <Row
      className="!mx-0 rounded-2xl p-7"
      gutter={[16, 16]}
      justify="space-between"
      style={{ background: bg }}
    >
      <Col span={24} md={12} xl={16} className="flex-1 text-center md:text-left">
        <div
          className="mt-4 text-lg font-semibold md:text-xl"
          style={{ color: themeToken.colorPrimaryActive }}
        >
          <h4>Welcome back 👋 </h4>
          <h4>{username}</h4>
        </div>
        <div
          style={{ color: themeToken.colorPrimaryTextActive }}
          className="mx-auto mb-6 mt-4 max-w-sm text-sm opacity-80 md:mx-0"
        >
          Ready to start your day? Explore new features and boost your productivity!
          <div />
        </div>
      </Col>

      <Col
        span={24}
        md={12}
        xl={8}
        className="!md:max-w-[320px] mx-auto !max-w-[270px] flex-none items-center justify-center "
      >
        <ThemeBannerSvg />
      </Col>
    </Row>
  )
}

function ThemeBannerSvg() {
  const { colorPrimary, colorPrimaryActive, colorPrimaryHover } = useThemeToken()
  return (
    <BannerSvg
      colorPrimary={colorPrimary}
      colorPrimaryActive={colorPrimaryActive}
      colorPrimaryHover={colorPrimaryHover}
    />
  )
}
