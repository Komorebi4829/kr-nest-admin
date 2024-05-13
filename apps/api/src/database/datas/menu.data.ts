import { MenuType } from '@/modules/rbac/constants'

export type MenuItem = {
    label: string
    name: string
    type: MenuType
    icon?: string
    customOrder?: number
    isFrame?: boolean
    frameSrc?: string
    isCache?: boolean
    path: string
    component?: string
    perms?: string
    query?: string
    visible?: boolean
    status?: boolean
    newFeature?: boolean
    hideTab?: boolean
    parent?: string | null
    children?: MenuItem[]
}

export const MENUS: MenuItem[] = [
    {
        label: 'sys.menu.dashboard',
        name: 'Dashboard',
        type: MenuType.CATALOGUE,
        icon: 'ic-analysis',
        // isFrame: 0,
        // isCache: 1,
        path: 'dashboard',
        // visible: true,
        // status: true,
        children: [
            {
                label: 'sys.menu.workbench',
                name: 'Workbench',
                type: MenuType.MENU,
                path: 'workbench',
                component: '/dashboard/workbench/index.tsx',
            },
            {
                label: 'sys.menu.analysis',
                name: 'Analysis',
                type: MenuType.MENU,
                path: 'analysis',
                component: '/dashboard/analysis/index.tsx',
            },
        ],
    },
    {
        label: 'sys.menu.management',
        name: 'Management',
        icon: 'ic-management',
        type: MenuType.CATALOGUE,
        path: 'management',
        children: [
            {
                label: 'sys.menu.user.index',
                name: 'User',
                type: MenuType.CATALOGUE,
                path: 'user',
                children: [
                    {
                        label: 'sys.menu.user.profile',
                        name: 'Profile',
                        type: MenuType.MENU,
                        path: 'profile',
                        component: '/management/user/profile/index.tsx',
                    },
                    {
                        label: 'sys.menu.user.account',
                        name: 'Account',
                        type: MenuType.MENU,
                        path: 'account',
                        component: '/management/user/account/index.tsx',
                    },
                ],
            },
            {
                label: 'sys.menu.system.index',
                name: 'System',
                type: MenuType.CATALOGUE,
                path: 'system',
                children: [
                    {
                        label: 'sys.menu.system.organization',
                        name: 'Organization',
                        type: MenuType.MENU,
                        path: 'organization',
                        component: '/management/system/organization/index.tsx',
                    },
                    {
                        label: 'sys.menu.system.permission',
                        name: 'Permission',
                        type: MenuType.MENU,
                        path: 'permission',
                        component: '/management/system/permission/index.tsx',
                    },
                    {
                        label: 'sys.menu.system.role',
                        name: 'Role',
                        type: MenuType.MENU,
                        path: 'role',
                        component: '/management/system/role/index.tsx',
                    },
                    {
                        label: 'sys.menu.system.user',
                        name: 'User',
                        type: MenuType.MENU,
                        path: 'user',
                        component: '/management/system/user/index.tsx',
                    },
                    {
                        label: 'sys.menu.system.user_detail',
                        name: 'User Detail',
                        type: MenuType.MENU,
                        path: 'user/:id',
                        component: '/management/system/user/detail.tsx',
                        visible: false,
                    },
                ],
            },
        ],
    },
    {
        label: 'sys.menu.components',
        name: 'Components',
        icon: 'solar:widget-5-bold-duotone',
        type: MenuType.CATALOGUE,
        path: 'components',
        children: [
            {
                label: 'sys.menu.icon',
                name: 'Icon',
                type: MenuType.MENU,
                path: 'icon',
                component: '/components/icon/index.tsx',
            },
            {
                label: 'sys.menu.animate',
                name: 'Animate',
                type: MenuType.MENU,
                path: 'animate',
                component: '/components/animate/index.tsx',
            },
            {
                label: 'sys.menu.scroll',
                name: 'Scroll',
                type: MenuType.MENU,
                path: 'scroll',
                component: '/components/scroll/index.tsx',
            },
            {
                label: 'sys.menu.markdown',
                name: 'Markdown',
                type: MenuType.MENU,
                path: 'markdown',
                component: '/components/markdown/index.tsx',
            },
            {
                label: 'sys.menu.editor',
                name: 'Editor',
                type: MenuType.MENU,
                path: 'editor',
                component: '/components/editor/index.tsx',
            },
            {
                label: 'sys.menu.i18n',
                name: 'Multi Language',
                type: MenuType.MENU,
                path: 'i18n',
                component: '/components/multi-language/index.tsx',
            },
            {
                label: 'sys.menu.upload',
                name: 'upload',
                type: MenuType.MENU,
                path: 'Upload',
                component: '/components/upload/index.tsx',
            },
            {
                label: 'sys.menu.chart',
                name: 'Chart',
                type: MenuType.MENU,
                path: 'chart',
                component: '/components/chart/index.tsx',
            },
        ],
    },
    {
        label: 'sys.menu.functions',
        name: 'functions',
        icon: 'solar:plain-2-bold-duotone',
        type: MenuType.CATALOGUE,
        path: 'functions',
        children: [
            {
                label: 'sys.menu.clipboard',
                name: 'Clipboard',
                type: MenuType.MENU,
                path: 'clipboard',
                component: '/functions/clipboard/index.tsx',
            },
        ],
    },
    {
        label: 'sys.menu.menulevel.index',
        name: 'Menu Level',
        icon: 'ic-menulevel',
        type: MenuType.CATALOGUE,
        path: 'menu-level',
        children: [
            {
                label: 'sys.menu.menulevel.1a',
                name: 'Menu Level 1a',
                type: MenuType.MENU,
                path: 'menu-level-1a',
                component: '/menu-level/menu-level-1a/index.tsx',
            },
            {
                label: 'sys.menu.menulevel.1b.index',
                name: 'Menu Level 1b',
                type: MenuType.CATALOGUE,
                path: 'menu-level-1b',
                children: [
                    {
                        label: 'sys.menu.menulevel.1b.2a',
                        name: 'Menu Level 2a',
                        type: MenuType.MENU,
                        path: 'menu-level-2a',
                        component: '/menu-level/menu-level-1b/menu-level-2a/index.tsx',
                    },
                    {
                        label: 'sys.menu.menulevel.1b.2b.index',
                        name: 'Menu Level 2b',
                        type: MenuType.CATALOGUE,
                        path: 'menu-level-2b',
                        children: [
                            {
                                label: 'sys.menu.menulevel.1b.2b.3a',
                                name: 'Menu Level 3a',
                                type: MenuType.MENU,
                                path: 'menu-level-3a',
                                component:
                                    '/menu-level/menu-level-1b/menu-level-2b/menu-level-3a/index.tsx',
                            },
                            {
                                label: 'sys.menu.menulevel.1b.2b.3b',
                                name: 'Menu Level 3b',
                                type: MenuType.MENU,
                                path: 'menu-level-3b',
                                component:
                                    '/menu-level/menu-level-1b/menu-level-2b/menu-level-3b/index.tsx',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        label: 'sys.menu.error.index',
        name: 'Error',
        icon: 'bxs:error-alt',
        type: MenuType.CATALOGUE,
        path: 'error',
        children: [
            {
                label: 'sys.menu.error.403',
                name: '403',
                type: MenuType.MENU,
                path: '403',
                component: '/sys/error/Page403.tsx',
            },
            {
                label: 'sys.menu.error.404',
                name: '404',
                type: MenuType.MENU,
                path: '404',
                component: '/sys/error/Page404.tsx',
            },
            {
                label: 'sys.menu.error.500',
                name: '500',
                type: MenuType.MENU,
                path: '500',
                component: '/sys/error/Page500.tsx',
            },
        ],
    },
    {
        label: 'sys.menu.calendar',
        name: 'Calendar',
        icon: 'solar:calendar-bold-duotone',
        type: MenuType.MENU,
        path: 'calendar',
        component: '/sys/others/calendar/index.tsx',
    },
    {
        label: 'sys.menu.kanban',
        name: 'kanban',
        icon: 'solar:clipboard-bold-duotone',
        type: MenuType.MENU,
        path: 'kanban',
        component: '/sys/others/kanban/index.tsx',
    },
    {
        label: 'sys.menu.disabled',
        name: 'Disabled',
        icon: 'ic_disabled',
        type: MenuType.MENU,
        path: 'disabled',
        status: false,
        component: '/sys/others/calendar/index.tsx',
    },
    {
        label: 'sys.menu.label',
        name: 'Label',
        icon: 'ic_label',
        type: MenuType.MENU,
        path: 'label',
        newFeature: true,
        component: '/sys/others/blank.tsx',
    },
    {
        label: 'sys.menu.frame',
        name: 'Frame',
        icon: 'ic_external',
        type: MenuType.CATALOGUE,
        path: 'frame',
        children: [
            {
                label: 'sys.menu.external_link',
                name: 'External Link',
                type: MenuType.MENU,
                path: 'external_link',
                hideTab: true,
                component: '/sys/others/iframe/external-link.tsx',
                isFrame: true,
                frameSrc: 'https://ant.design/',
            },
            {
                label: 'sys.menu.iframe',
                name: 'Iframe',
                type: MenuType.MENU,
                path: 'frame',
                component: '/sys/others/iframe/index.tsx',
                isFrame: true,
                frameSrc: 'https://ant.design/',
            },
        ],
    },
    {
        label: 'sys.menu.blank',
        name: 'Disabled',
        icon: 'ic_blank',
        type: MenuType.MENU,
        path: 'blank',
        component: '/sys/others/blank.tsx',
    },
]
