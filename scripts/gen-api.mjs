// Genera src/lib/api-schema.d.ts a partir del contrato de la API de Inventario.
//
//   npm run gen:api            # desde api/swagger.json (versionado; no necesita la API)
//   npm run gen:api:fetch      # baja el swagger de la API local, lo guarda y genera
//   SWAGGER_URL=https://otra/swagger/v1/swagger.json npm run gen:api:fetch
//
// Tanto api/swagger.json como el .d.ts se versionan: el build no depende de que
// la API esté arriba y los cambios de contrato aparecen en el diff del PR. No se
// edita a mano; los alias que usan las pantallas viven en src/lib/api-types.ts.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import openapiTS, { astToString } from 'openapi-typescript';

const CONTRATO = 'api/swagger.json';
const SALIDA = 'src/lib/api-schema.d.ts';
const URL_LOCAL = 'https://localhost:50005/swagger/v1/swagger.json';

/** Baja el swagger y lo guarda formateado, para que el diff del PR sea legible. */
async function bajarContrato(origen) {
  // inventarioBE en local usa el certificado de desarrollo de .NET, que Node no
  // reconoce. Solo para localhost se acepta sin validar.
  if (['localhost', '127.0.0.1'].includes(new URL(origen).hostname)) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  const res = await fetch(origen);
  if (!res.ok) throw new Error(`HTTP ${res.status} al bajar ${origen}`);
  const json = await res.json();
  await writeFile(CONTRATO, JSON.stringify(json, null, 2) + '\n');
  console.log(`Contrato guardado en ${CONTRATO} desde ${origen}`);
}

try {
  if (process.argv.includes('--fetch')) {
    await bajarContrato(process.env.SWAGGER_URL ?? URL_LOCAL);
  }
  const { info } = JSON.parse(await readFile(CONTRATO, 'utf8'));
  const ast = await openapiTS(pathToFileURL(resolve(CONTRATO)));
  const encabezado =
    '// ARCHIVO GENERADO por `npm run gen:api`. No editar a mano.\n' +
    `// Origen: ${CONTRATO} (${info?.title ?? 'API'} ${info?.version ?? ''})\n\n`;
  await writeFile(SALIDA, encabezado + astToString(ast));
  console.log(`Tipos generados en ${SALIDA}`);
} catch (err) {
  console.error(`No se pudo generar ${SALIDA}:`, err instanceof Error ? err.message : err);
  console.error('Para bajar el contrato, levanta inventarioBE en local y usa npm run gen:api:fetch.');
  process.exit(1);
}
