import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/tv_show_tracker_claude/ on GitHub Pages.
  base: '/tv_show_tracker_claude/',
  plugins: [react()],
})
