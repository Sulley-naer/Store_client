import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import nightwatchPlugin from 'vite-plugin-nightwatch'
import vueDevTools from 'vite-plugin-vue-devtools'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env.VITE_API_KEY)
  return defineConfig({
    envPrefix: 'VITE_',
    plugins: [vue({
      include: [/\.vue$/, /\.md$/],
    }),
      vueJsx(), nightwatchPlugin(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_KEY, // 目标地址
          changeOrigin: true, // 是否改变源
          secure: false //关闭服务器证书验证
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  })
})