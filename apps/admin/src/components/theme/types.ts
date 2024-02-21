import { ThemeMode } from './constants';

/**
 * 主题配置
 */
export interface ThemeConfig {
    /** 主题模式 */
    mode?: `${ThemeMode}`;
    /** 紧凑模式 */
    compact?: boolean;
}

/**
 * 主题组件状态池
 */
export type ThemeState = Required<ThemeConfig>;
/**
 * 主题状态更改函数
 */
export interface ThemeAction {
    changeMode: (mode: `${ThemeMode}`) => void;
    toggleMode: () => void;
    changeCompact: (compact: boolean) => void;
    toggleCompact: () => void;
}
