import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@amplifyClient': process.env.VITE_USE_LOCAL_AMPLIFY === 'true'
        ? '/src/amplifyClient.dev.ts'
        : '/src/amplifyClient.prod.ts'
    }
  }
});
