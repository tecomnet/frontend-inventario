# Inventario (inventario-react)

Panel de inventario TECOMNET. Migración del panel vanilla JS original
(conservado en [`legacy/`](./legacy)) a la misma arquitectura y estilos que
el panel `WebAdmin`:

- **Frontend:** React 19 + TypeScript + Vite + React Router + Recharts + Bootstrap 5 / bootstrap-icons.
- **BFF:** Express desplegable como **función Lambda** (`serverless-http`). Hace de proxy
  de `/api/*` hacia la API de Inventario y gestiona la sesión del panel (cookie JWT).
- **Deploy (el más barato):** Amplify Hosting (SPA) + Lambda Function URL. Ver [`DEPLOY.md`](./DEPLOY.md).

## Módulos
Inicio (dashboard), Sims, Productos, Marcas, Presentaciones, Unidades de Medida,
Proveedores, Líneas, Compras, Movimientos de Almacén, Existencias, Buscar Existencias,
Importador de Inventario, Importador de Sims, Kardex, Empresas, Unidades de Negocio,
Almacenes y Tipos de Transacción. Todo el CRUD y consultas del panel original,
apuntando a los mismos endpoints de la API.

## Autenticación
La API de Inventario todavía **no tiene login**. El BFF arranca en modo
`AUTH_MODE=placeholder`: la pantalla de login existe y crea sesión con cualquier
credencial. Cuando exista el endpoint real, pon `AUTH_MODE=api` y `AUTH_LOGIN_PATH`
en las variables de entorno (no hay que tocar código).

## Desarrollo local
```bash
npm install
cp .env.example .env      # completa SESSION_SECRET
npm run dev               # BFF (3003) + Vite (5175) en paralelo
```
Abre http://localhost:5175. El proxy de Vite reenvía `/api/*` al BFF.

## Scripts
| Script | Qué hace |
|---|---|
| `npm run dev` | BFF + front en paralelo (dev). |
| `npm run build` | Compila el front a `dist/` (lo que corre Amplify). |
| `npm run build:lambda` | Empaqueta el BFF en `lambda/index.cjs`. |
| `npm run lint` | ESLint. |

## Variables de entorno (BFF / Lambda)
Ver [`.env.example`](./.env.example) y la tabla en [`DEPLOY.md`](./DEPLOY.md#variables-de-entorno-de-la-función-lambda).

| Variable | Default | Descripción |
|---|---|---|
| `API_BASE` | `https://tecomnet.net/Inventario/api` | API de Inventario a la que el BFF hace proxy. |
| `API_TIMEOUT` | `30` | Timeout en segundos. |
| `SESSION_SECRET` | *(obligatorio en prod)* | Firma la cookie de sesión. |
| `SESSION_TIMEOUT` | `600` | Inactividad de sesión (s). |
| `AUTH_MODE` | `placeholder` | `placeholder` o `api`. |
| `AUTH_LOGIN_PATH` | `/Auth/Login` | Endpoint de login (solo con `AUTH_MODE=api`). |
