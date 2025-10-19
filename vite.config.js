import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
server: {
    host: true, // أو "0.0.0.0"
    port: 5173,
  },
  plugins: [react(), tailwindcss()],
})

