import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoImport from 'unplugin-auto-import/vite'
import path from 'path'
import prismjs from 'vite-plugin-prismjs'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    autoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: './src/auto-import.d.ts',

      eslintrc: {
        enabled: true
      }
    }),
    vue(),
    vueJsx(),
    prismjs({
      languages: 'all'
    }),
    viteCompression()
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://150.158.91.46:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
