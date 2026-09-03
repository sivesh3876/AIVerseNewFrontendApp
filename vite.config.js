import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget =
    env.VITE_API_PROXY_TARGET ||
    (env.VITE_API_BASE_URL || '')
      .replace(/\/api\/?$/, '')
      .trim() ||
    'https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net'

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
