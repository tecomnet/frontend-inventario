# Inventario · TECOMNET

Panel web de inventario de TECOMNET. Es la migración del panel original en
JavaScript vanilla (conservado en [`legacy/`](./legacy)) a la misma arquitectura,
estilos y esquema de despliegue que el panel `WebAdmin`.

- **App en vivo:** https://main.d1abw560spc16b.amplifyapp.com
- **Repositorio:** https://github.com/AlexDommi/Inventario

---

## Índice
- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos](#módulos)
- [Autenticación](#autenticación)
- [Desarrollo local](#desarrollo-local)
- [Scripts](#scripts)
- [Variables de entorno](#variables-de-entorno)
- [Despliegue en AWS](#despliegue-en-aws)
- [Auto-deploy](#auto-deploy)
- [Recursos AWS creados](#recursos-aws-creados)

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Ruteo | react-router-dom v7 (SPA) |
| UI | Bootstrap 5 + bootstrap-icons |
| Gráficas | Recharts |
| BFF | Express 5 (desplegado como Lambda con `serverless-http`) |
| Sesión | Cookie JWT httpOnly (`jsonwebtoken`) |
| Hosting | AWS Amplify Hosting (front) + Lambda Function URL (BFF) |

---

## Arquitectura

El navegador **siempre habla con su mismo origen** (`/api/*`). Amplify sirve la SPA
estática y reenvía `/api/*` (rewrite 200) a la Function URL del Lambda. El Lambda
(BFF) valida la sesión del panel y hace de **proxy** hacia la API de Inventario.

```
Navegador ── https://…amplifyapp.com ─┬─ /            → index.html (SPA, dist/)
                                       └─ /api/<*>     → (rewrite 200) → Lambda Function URL
                                                                            │
                                                     BFF (server/) ── proxy ──> API de Inventario
                                                                              (https://tecomnet.net/Inventario/api)
```

**Por qué un BFF (y no llamar la API directo):**
- El navegador nunca toca otro dominio → sin problemas de CORS.
- Punto único para la sesión del panel (cookie httpOnly) y, a futuro, el login real.
- La URL de la API vive como variable de entorno del Lambda, no en el front.

---

## Estructura del proyecto

```
Inventario/
├── index.html                 # HTML raíz (Vite) + carga de fuente
├── amplify.yml                # Build settings de Amplify Hosting
├── DEPLOY.md                  # Guía detallada de despliegue en AWS
├── .env.example               # Plantilla de variables del BFF
├── .github/workflows/
│   └── deploy-lambda.yml       # CI: actualiza el Lambda en cada push a server/
├── public/img/                # Logos (Mundo2.png, LetrasTecomnet.png, logo1.png…)
├── server/                    # BFF (Express) — se empaqueta como Lambda
│   ├── app.ts                 # Rutas: /api/auth y proxy genérico /api/*
│   ├── apiClient.ts           # Proxy HTTP hacia la API de Inventario
│   ├── session.ts             # Sesión del panel (cookie JWT)
│   ├── config.ts              # Config desde variables de entorno
│   ├── env.ts                 # Carga .env en local
│   ├── index.ts               # Arranque local (dev)
│   └── lambda.ts              # Handler para AWS Lambda
├── src/
│   ├── main.tsx               # Entry: providers + router + estilos
│   ├── App.tsx                # Definición de rutas
│   ├── components/
│   │   ├── AppLayout.tsx       # Sidebar + layout del panel
│   │   ├── RequireAuth.tsx     # Guard de rutas (exige sesión)
│   │   ├── DynamicTable.tsx    # Tabla para resultados de consulta
│   │   ├── DescripcionCatalog.tsx # Catálogo genérico { id, descripcion }
│   │   └── NodeNetwork.tsx     # Fondo animado del login
│   ├── context/
│   │   ├── AuthContext.tsx     # Sesión, inactividad, logout
│   │   └── UIContext.tsx       # Toasts (notify) + overlay de carga
│   ├── lib/
│   │   ├── api.ts              # Cliente HTTP hacia el BFF (/api/*)
│   │   └── format.ts           # Helpers de formato (fechas, celdas…)
│   ├── pages/                 # Una página por módulo (ver abajo)
│   └── styles/
│       ├── admin.css           # Estilos del panel
│       └── login.css           # Estilos del login (scoped a .login-page)
└── legacy/                    # App original en JS vanilla (referencia)
```

---

## Módulos

Todas las páginas viven en [`src/pages/`](./src/pages) y consumen la API a través
del BFF. Se conservó toda la funcionalidad del panel original.

| Módulo | Página | Endpoints (vía `/api`) |
|---|---|---|
| Dashboard | `Inicio.tsx` | `GET /Productos` (KPIs + gráficas) |
| Sims | `Sims.tsx` | `GET /Catalogos/simdet/pages`, `PUT /Catalogos/simdet` |
| Productos | `Productos.tsx` | `GET/POST/PUT/DELETE /Productos` |
| Marcas | `Marcas.tsx` | `GET/POST/PUT /Catalogos/marcas` |
| Presentaciones | `Presentaciones.tsx` | `GET/POST/PUT /Catalogos/presentaciones` |
| Unidades de Medida | `UnidadesMedida.tsx` | `GET/POST/PUT /Catalogos/unidadesmedida` |
| Proveedores | `Proveedores.tsx` | `GET/POST/PUT /Catalogos/proveedores` |
| Líneas | `Lineas.tsx` | `GET/POST/PUT /Catalogos/lineas` |
| Compras | `Compras.tsx` | `GET /Compras` |
| Movimientos de Almacén | `Movimientos.tsx` | `GET /MovimientosDeAlmacen` |
| Existencias (listado) | `Existencias.tsx` | `GET /Existencias` |
| Buscar Existencias | `BuscarExistencias.tsx` | `GET /Existencias/buscar` |
| Importador Inventario | `Importador.tsx` | `POST /importador/importador` (multipart) |
| Importador Sims | `ImportadorSims.tsx` | `POST /Importador/ImportadorSims` (multipart) |
| Kardex | `Kardex.tsx` | `GET /Kardex` |
| Empresas | `Empresas.tsx` | `GET/POST/PUT /Catalogos/empresas` |
| Unidades de Negocio | `UnidadesNegocio.tsx` | `GET/POST/PUT/DELETE /Catalogos/unidadesnegocio` |
| Almacenes | `Almacenes.tsx` | `GET/POST/PUT/DELETE /Catalogos/almacenes` |
| Tipos de Transacción | `TiposTransaccion.tsx` | `GET /Catalogos/tipostransaccion` |

---

## Autenticación

La API de Inventario **todavía no tiene endpoint de login**. Por eso el BFF corre en
modo *placeholder* (`AUTH_MODE=placeholder`): la pantalla de login existe y crea
sesión con **cualquier** correo y contraseña (ambos campos no vacíos). La sesión es
una cookie JWT httpOnly que expira por inactividad (`SESSION_TIMEOUT`, 10 min en el
front).

Cuando exista el endpoint real de la API, **no hay que tocar código**: se cambia en
las variables del Lambda `AUTH_MODE=api` y `AUTH_LOGIN_PATH=/ruta/del/login`, y el
BFF validará usuario/contraseña contra la API. Ver [`server/app.ts`](./server/app.ts).

---

## Desarrollo local

Requisitos: Node.js 20+ (probado en 24).

```bash
npm install
cp .env.example .env       # completa SESSION_SECRET
npm run dev                # BFF (:3003) + Vite (:5175) en paralelo
```

Abre http://localhost:5175. El proxy de Vite reenvía `/api/*` al BFF local.

---

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Levanta BFF + front en paralelo (desarrollo). |
| `npm run build` | Compila el front a `dist/` (lo que corre Amplify). |
| `npm run build:lambda` | Empaqueta el BFF en `lambda/index.cjs` (bundle único). |
| `npm run lint` | ESLint. |
| `npm run preview` | Sirve el `dist/` compilado localmente. |

---

## Variables de entorno

Solo las usa el **BFF** (`.env` en local; variables de la función en Amplify/Lambda).
El front no lleva secretos. Plantilla en [`.env.example`](./.env.example).

| Variable | Default | Descripción |
|---|---|---|
| `API_BASE` | `https://tecomnet.net/Inventario/api` | API de Inventario a la que el BFF hace proxy. |
| `API_TIMEOUT` | `30` | Timeout de las llamadas a la API (segundos). |
| `SESSION_SECRET` | *(obligatorio en prod)* | Firma la cookie de sesión (JWT). |
| `SESSION_TIMEOUT` | `600` | Inactividad de la sesión (segundos). |
| `AUTH_MODE` | `placeholder` | `placeholder` (login abierto) o `api` (valida contra la API). |
| `AUTH_LOGIN_PATH` | `/Auth/Login` | Ruta del login en la API (solo con `AUTH_MODE=api`). |
| `NODE_ENV` | — | En `production` hace obligatorio `SESSION_SECRET`. |

Generar un `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

---

## Despliegue en AWS

Resumen (guía completa en [`DEPLOY.md`](./DEPLOY.md)):

1. **Front → Amplify Hosting.** Conectas el repo; Amplify usa `amplify.yml`
   (`npm run build` → `dist/`) y despliega en cada push.
2. **BFF → Lambda.** `npm run build:lambda` genera `lambda/index.cjs`; se sube
   como función Node 20 (handler `index.handler`) con una **Function URL** (auth NONE)
   y las variables de entorno de arriba.
3. **Rewrites de Amplify** (en orden):
   | # | Source | Target | Type |
   |---|---|---|---|
   | 1 | `/api/<*>` | `https://<function-url>/api/<*>` | 200 (Rewrite) |
   | 2 | `/<*>` | `/index.html` | 200 (Rewrite) |

---

## Auto-deploy

- **Front:** Amplify redepliega solo en cada push a `main` (webhook de GitHub creado).
- **BFF:** el workflow [`.github/workflows/deploy-lambda.yml`](./.github/workflows/deploy-lambda.yml)
  recompila y actualiza el Lambda en cada push que toque `server/`. Requiere estos
  *secrets* en GitHub (Settings → Secrets and variables → Actions):
  `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `LAMBDA_FUNCTION_NAME`.

---

## Recursos AWS creados

Cuenta `607700978058`, región `us-east-1`:

| Recurso | Nombre / valor |
|---|---|
| Amplify app (front) | `Inventario` (`d1abw560spc16b`) → https://main.d1abw560spc16b.amplifyapp.com |
| Lambda (BFF) | `inventario-bff` (Node 20, handler `index.handler`, 30 s) |
| Function URL | `https://n7sdjbanxoujswtfxlkmnbjhzi0atdqx.lambda-url.us-east-1.on.aws/` |
| Rol de ejecución | `inventario-bff-role` |
| Usuario IAM de CI | `inventario-ci-deployer` (solo `lambda:UpdateFunctionCode`) |

---

## Legacy

La aplicación original en JavaScript vanilla se conservó en [`legacy/`](./legacy)
como referencia. No se usa en el despliegue.
