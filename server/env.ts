// Carga .env (solo si existe) ANTES de que config.ts lea process.env.
// En Amplify/Lambda no hay .env: las variables vienen del entorno.
import { existsSync } from 'node:fs';

if (existsSync('.env')) {
  try {
    process.loadEnvFile('.env');
  } catch {
    /* Node < 20.12 o sin permiso: se ignora y se usan defaults/entorno */
  }
}
