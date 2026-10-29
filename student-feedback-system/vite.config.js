import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
server: {
proxy: {
'/n8n-webhook': {
target: 'https://mhlanga.app.n8n.cloud',
changeOrigin: true,
rewrite: (path) => path.replace(/^\/n8n-webhook/, '/webhook'),
},
},
},
})
