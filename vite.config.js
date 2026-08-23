import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // relative asset URLs, so the build works both at
  // nekofiore.github.io/home/ and at the domain root (custom domain)
  base: './',
})
