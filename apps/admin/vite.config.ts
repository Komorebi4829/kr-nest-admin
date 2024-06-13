import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import dayjs from 'dayjs'
import { visualizer } from 'rollup-plugin-visualizer'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import tsconfigPaths from 'vite-tsconfig-paths'

const pkgJson = require(resolve(__dirname, './package.json'))

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  esbuild: {
    // drop: ['console', 'debugger'],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    // 开css sourcemap方便找css
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './', 'src'),
      '#': resolve(__dirname, './', 'typings'),
    },
  },
  plugins: [
    react(),
    // 同步tsconfig.json的path设置alias
    tsconfigPaths(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    visualizer({
      open: false,
    }),
    Icons({ compiler: 'jsx', jsx: 'react' }),
  ],

  server: {
    // 自动打开浏览器
    open: false,
    host: true,
    port: 2221,
    proxy: {
      /* manage endpoint */
      '^/manage/api': {
        target: 'http://127.0.0.1:2121',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api\/manage/, '/manage/api'),
      },
      /* client endpoint */
      '^/api': {
        target: 'http://127.0.0.1:2121',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api\/client/, '/api'),
      },
    },
    cors: true,
  },
  define: createDefineData(process.cwd()),
  build: {
    target: 'esnext',
    minify: 'terser',
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes('node_modules')) {
    //         // 让每个插件都打包成独立的文件
    //         return id.toString().split('node_modules/')[1].split('/')[0].toString();
    //       }
    //       return null;
    //     },
    //   },
    // },
    terserOptions: {
      compress: {
        // 生产环境移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})

function createDefineData(root: string) {
  try {
    const { dependencies, devDependencies, name, version } = pkgJson

    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    }
  } catch (error) {
    return {}
  }
}
