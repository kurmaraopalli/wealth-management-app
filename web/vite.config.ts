import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/wealth-management-app/',   // ✅ important for GitHub Pages
  build: {
    outDir: 'dist'
  }
});
