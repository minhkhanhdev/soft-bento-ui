import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/soft-bento-ui/',
  plugins: [react(), tailwindcss()],
});
