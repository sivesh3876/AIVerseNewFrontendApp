import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiBaseUrl = env.VITE_API_BASE_URL?.trim()
  const proxyTarget =
    env.VITE_API_PROXY_TARGET ||
    (apiBaseUrl?.startsWith('http')
      ? apiBaseUrl.replace(/\/api\/?$/, '')
      : 'http://localhost:7071')

  return {
    plugins: [react()],
    server: {
      port: 5175,
      strictPort: false,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
