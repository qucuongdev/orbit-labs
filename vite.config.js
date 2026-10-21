import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteStaticCopy({ targets: ['Workers', 'ThirdParty', 'Assets', 'Widgets'].map(name => ({ src: `node_modules/cesium/Build/Cesium/${name}`, dest: 'cesium' })) })],
  define: { CESIUM_BASE_URL: JSON.stringify('/cesium/') },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()]
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
