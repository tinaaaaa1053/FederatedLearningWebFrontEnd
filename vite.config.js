import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    host: true,
    open: true,
    proxy: {
      // 代理所有以 /api 开头的请求
      '/api': {
        target: 'http://127.0.0.1:3000', // 将 localhost 改为 127.0.0.1 后端 Python 服务地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // <--- 这一行必须删掉或注释掉
        // 删掉后：请求 /api/jobs -> 转发到 http://localhost:3000/api/jobs (正确)
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'echarts-vendor': ['echarts']
        }
      }
    }
  }
})