import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En dev, /api/* se reenvía al BFF Express (server/) en el puerto 3003.
// En producción ese mismo BFF se despliega como función (Lambda/Amplify).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
  },
});
