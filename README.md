# Inventario · TECOMNET

Panel web de inventario de TECOMNET. Comparte arquitectura, estilos y esquema de
despliegue con el panel `WebAdmin`.

- **App en vivo:** https://main.d1abw560spc16b.amplifyapp.com
- **Repositorio:** https://github.com/tecomnet/frontend-inventario
- **API:** https://github.com/tecomnet/inventario
- **Cómo contribuir:** [`CONTRIBUTING.md`](./CONTRIBUTING.md) (ramas, commits `KL-###`, PR y revisión)

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
- Punto único para el login real, la sesión del panel (cookie httpOnly) y el token
  JWT que la API exige en cada llamada.
- La URL de la API vive como variable de entorno del Lambda, no en el front.

---

## Estructura del proyecto

```
Inventario/
├── index.html                 # HTML raíz (Vite) + carga de fuente
├── amplify.yml                # Build settings de Amplify Hosting
├── DEPLOY.md                  # Guía detallada de despliegue en AWS
├── .env.example               # Plantilla de variables del BFF
├── CONTRIBUTING.md            # Flujo de trabajo: ramas, commits, PR y revisión
├── .githooks/                 # Hooks que exigen la clave KL-### en cada commit
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       ├── deploy-lambda.yml   # CI: actualiza el Lambda en cada push a server/
│       └── jira-convention.yml # CI: valida KL-### en el título y los commits del PR
├── public/img/                # Logos (Mundo2.png, LetrasTecomnet.png, logo1.png…)
├── server/                    # BFF (Express) — se empaqueta como Lambda
│   ├── app.ts                 # Rutas: /api/auth y proxy genérico /api/*
│   ├── apiClient.ts           # Proxy HTTP hacia la API (inyecta Authorization: Bearer)
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
```

---

## Módulos

Todas las páginas viven en [`src/pages/`](./src/pages) y consumen la API a través
del BFF.

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

## Sistema de diseño

Misma capa visual que el panel WebAdmin, en [`src/styles/admin.css`](./src/styles/admin.css)
(panel) y [`src/styles/login.css`](./src/styles/login.css) (login, *scoped* a `.login-page`).

- **Tipografía:** [Lato](https://fonts.google.com/specimen/Lato) (Google Fonts), aplicada a
  todo el panel vía la variable `--tec-font` y `--bs-body-font-family` (para que también la
  usen los componentes de Bootstrap).
- **Chrome del panel:** sidebar oscuro (degradado navy) con el logo `logo1.png`, grupos
  colapsables e ítems con estado activo; contenido en tema claro. Toggle del menú tipo
  "pestaña" en el borde del sidebar.
- **Tarjetas** (`.table-card`, `.form-card`, `.kpi-card`, `.dash-card`): radio 14px, sombra en
  capas y elevación al hover. Tablas con encabezado claro y paginación estilizada.
- **Login:** fondo oscuro con red de nodos animada en `<canvas>` ([`NodeNetwork`](./src/components/NodeNetwork.tsx),
  respeta `prefers-reduced-motion`), tarjeta *glassmorphism* y logotipo TECOMNET.

---

## Autenticación

**La API de Inventario no es abierta.** Desde KL-7 tiene `FallbackPolicy` y exige un
JWT en todos sus endpoints salvo el login, así que **cada** petición que el BFF reenvía
lleva `Authorization: Bearer <token>` ([`server/apiClient.ts`](./server/apiClient.ts)).

**Login.** El front manda `{ Username, Password }` a `POST /api/auth?action=login`; el
BFF lo valida contra `AUTH_LOGIN_PATH` (`/Auth/login`) de la API. Si la API responde 2xx
con `{ token }`, el BFF crea la sesión y devuelve solo `{ ok: true }`; si no, devuelve el
`mensaje` de la API y no crea sesión. Ver [`server/app.ts`](./server/app.ts).

**Sesión del panel.**
- Es una cookie JWT **httpOnly** firmada, que expira por inactividad (`SESSION_TIMEOUT`;
  el front además cierra sesión a los 10 min sin actividad) y se renueva en cada petición
  válida.
- El token de la API viaja **cifrado** (AES-256-GCM) dentro de esa cookie
  ([`server/session.ts`](./server/session.ts)). El navegador nunca lo ve: no está en
  `localStorage`, ni en `document.cookie`, ni en las respuestas del BFF.

**Los tres errores de autorización** se responden distinto, para que el front no confunda
"falta permiso" con "sesión caída":

| Caso | Respuesta del BFF | Qué hace el front |
|---|---|---|
| No hay sesión del panel (401 **del BFF**) | `401 { login: true, motivo: 'sin-sesion' }` | Va a `/login` con el aviso. |
| La API rechaza el token — vencido o inválido (401 **de la API**) | `401 { login: true, motivo: 'token-expirado' }`, y el BFF **borra la cookie** | Va a `/login` con el aviso. |
| La API responde **403** (el rol no alcanza) | `403 { error, title, sinPermiso: true }`; la sesión **no se toca** | Muestra un aviso y se queda en la pantalla. |

El aviso de sesión caída se dispara **una sola vez** aunque varias peticiones de la misma
pantalla devuelvan 401 a la vez ([`src/lib/api.ts`](./src/lib/api.ts)): por eso un token
vencido lleva al login una sola vez y no en ciclo. El aviso de 403 es solo para las
**lecturas**: en una escritura la pantalla ya reporta el fallo por su cuenta y saldrían
dos avisos por lo mismo.

**Modo placeholder.** `AUTH_MODE=placeholder` (acepta cualquier credencial y crea sesión
sin token) solo funciona en desarrollo local; con `NODE_ENV=production`, y siempre en el
Lambda, se ignora. Si una sesión sin token llega al proxy en modo `api`, se cierra y se
manda al login como token vencido.

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
| `npm run format -- <archivos>` | Formatea con Prettier los archivos indicados. |
| `npm run format:check -- <archivos>` | Revisa el formato sin modificar. |
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
| `AUTH_MODE` | `api` | `api` (valida contra la API). `placeholder` (login abierto) solo en desarrollo. |
| `AUTH_LOGIN_PATH` | `/Auth/login` | Ruta del login relativa a `API_BASE`. |
| `NODE_ENV` | — | En `production` hace obligatorio `SESSION_SECRET` y desactiva `placeholder`. El Lambda la fija siempre. |

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
