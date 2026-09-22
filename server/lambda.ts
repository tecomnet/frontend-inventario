// Wrapper para desplegar el BFF como función Lambda (Amplify/Function URL).
import './production.js'; // debe ir primero: fija NODE_ENV antes que config
import './env.js';
import serverless from 'serverless-http';
import { createApp } from './app.js';

// binary: reenvía multipart (importadores) sin corromper el cuerpo.
export const handler = serverless(createApp(), {
  binary: ['multipart/*', 'application/octet-stream'],
});
