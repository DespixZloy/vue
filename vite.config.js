import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Все запросы к /api будут проксироваться на целевой хост
      '/api': {
        target: 'http://109.73.206.144:6969',
        changeOrigin: true,
        // Ничего переписывать не нужно, path /api/... перейдет в http://host:port/api/...
        secure: false,
      },
    },
  },
})
