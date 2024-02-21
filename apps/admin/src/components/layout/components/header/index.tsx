import { Layout, Space, theme as AntdTheme } from 'antd';

import clsx from 'clsx';
import { CSSProperties, useCallback, useMemo } from 'react';

import Icon from '@/components/icon/icon';

import Theme from '@/components/theme';
import { useResponsive, useResponsiveMobileCheck } from '@/utils/hooks';

import { useLayout, useLayoutAction, useLayoutTheme } from '../../hooks';
import { useDrawer, useDrawerChange } from '../drawer/hooks';

import { SideMenu } from '../menu';
import { Logo } from '../sidebar/logo';

const Setting = () => {
    const drawer = useDrawer();
    const changeDrawerVisible = useDrawerChange();
    const toggleDrawer = useCallback(() => changeDrawerVisible(!drawer), [drawer]);
    return <Icon name="fy:carbon:settings" className="cursor-pointer" onClick={toggleDrawer} />;
};
export const LayoutHeader = () => {
    const { Header } = Layout;
    const { isNotebook } = useResponsive();
    const isMobile = useResponsiveMobileCheck();
    const { mode, collapsed, menu, styles: layoutStyles } = useLayout();
    const theme = useLayoutTheme();
    const { toggleCollapse, toggleMobileSide } = useLayoutAction();
    const sideCtrol = useCallback(() => {
        isMobile ? toggleMobileSide() : toggleCollapse();
    }, [isMobile, isNotebook]);
    const {
        token: { colorBgContainer },
    } = AntdTheme.useToken();
    const styles = useMemo<CSSProperties>(
        () => ({
            height: layoutStyles.headerHeight,
            lineHeight: layoutStyles.headerHeight,
            background: colorBgContainer,
        }),
        [theme.header, layoutStyles],
    );
    const classes = useMemo(() => {
        if (theme.header === 'dark') return '!tw-text-[rgba(255,255,255,0.65)]';
        return '!bg-white';
    }, [theme.header]);
    return (
        <Header style={styles} className={clsx(`tw-flex tw-content-between !tw-px-2 ${classes}`)}>
            <Space>
                {!isMobile && mode !== 'side' ? (
                    <div className="flex-none">
                        <Logo style={{ backgroundColor: '#000', height: '30px', width: '150px' }} />
                    </div>
                ) : null}
                {((mode !== 'top' && mode !== 'embed') || isMobile) && (
                    <Icon
                        name={
                            collapsed
                                ? 'fy:ant-design:menu-unfold-outlined'
                                : 'fy:ant-design:menu-fold-outlined'
                        }
                        // component={collapsed ? MenuUnFold : MenuFold}
                        className="cursor-pointer"
                        onClick={sideCtrol}
                    />
                )}
            </Space>
            <div className="tw-flex-auto">
                {mode === 'top' ? (
                    <SideMenu mode="horizontal" theme={theme.header} menu={menu} />
                ) : null}
            </div>
            <Space className="tw-flex-none">
                <Theme />
                <Setting />
            </Space>
        </Header>
    );
};
