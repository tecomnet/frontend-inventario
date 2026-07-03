// Arranque local del BFF (dev). En producción se usa lambda.ts.
import './env.js'; // debe ir primero: carga .env antes que config
import { createApp } from './app.js';

const PORT = Number(process.env.PORT ?? 3003);
createApp().listen(PORT, () => {
  console.log(`[BFF] escuchando en http://localhost:${PORT}`);
});
