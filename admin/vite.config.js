import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  envDir: path.resolve(__dirname, '..'),
  plugins: [react()],
  resolve: {
    alias: {
      '@Component': path.resolve(__dirname, 'src/components'),
      '@Pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/Utils'),
      '@Store': path.resolve(__dirname, 'src/store'),
    }
  }
})
