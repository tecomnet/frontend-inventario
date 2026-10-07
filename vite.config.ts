/// <reference types="vitest/config" />
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
  // Pruebas (npm test). Mismo esquema que frontendRecargas: las pruebas viven
  // en carpetas test/ y el front corre en jsdom con globals. A diferencia de
  // Recargas aquí también hay BFF, que se prueba aparte en Node.
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'server',
          include: ['server/test/**/*.test.ts'],
          environment: 'node',
          // Entorno fijo para que no dependa del .env ni de la shell de quien corre.
          env: { NODE_ENV: 'test', AUTH_MODE: 'api', SESSION_SECRET: 'secreto-de-pruebas' },
        },
      },
      {
        extends: true,
        test: {
          name: 'web',
          include: ['src/test/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
        },
      },
    ],
  },
});
