# Deploy en AWS — Inventario (inventario-react)

Mismo esquema (y precio) que el panel WebAdmin:

- **Front (SPA estática)** → **AWS Amplify Hosting** (build con `amplify.yml`, auto-deploy en cada push).
- **BFF (`server/`)** → una **función Lambda** (Node 20) expuesta por **Function URL** (sin API Gateway = sin costo extra).
- El front llama `/api/*` en su mismo origen; un **rewrite** de Amplify reenvía `/api/*` a la Function URL del Lambda, y el Lambda hace de proxy a la API de Inventario.

```
Navegador ── https://<tu-app>.amplifyapp.com ─┬─ /            → index.html (SPA, dist/)
                                              └─ /api/<*>     → (rewrite 200) → Lambda Function URL
                                                                                   │
                                                          BFF (server/) ── proxy ──> API de Inventario
                                                                                    (https://tecomnet.net/Inventario/api)
```

La autenticación aún no existe en la API de Inventario. El BFF arranca en modo
`AUTH_MODE=placeholder`: la pantalla de login acepta cualquier credencial y crea
sesión. Cuando exista el endpoint real, cambia a `AUTH_MODE=api` y define
`AUTH_LOGIN_PATH` (ver paso 2.7).

---

## 1) Front en Amplify Hosting

1. Sube el repo a **GitHub**.
2. Consola de **AWS Amplify** → *Create new app* → *Host web app* → conecta el repo y la rama.
3. Amplify detecta [`amplify.yml`](./amplify.yml) (build → `dist/`). Confirma y despliega.

> El front usa rutas **relativas** (`/api/...`), así que en cuanto el rewrite esté puesto funciona sin tocar código.

## 2) BFF como función Lambda

1. Genera el bundle (un solo archivo, sin `node_modules`):
   ```bash
   npm run build:lambda          # -> lambda/index.cjs
   ```
2. Empaquétalo en zip (PowerShell, con el archivo en la **raíz** del zip):
   ```powershell
   Compress-Archive -Path lambda\index.cjs -DestinationPath lambda.zip -Force
   ```
3. Consola de **Lambda** → *Create function* → *Author from scratch*:
   - Runtime: **Node.js 20.x**
   - Nombre: p. ej. `inventario-bff`
4. *Code* → *Upload from* → *.zip file* → sube `lambda.zip`.
5. *Runtime settings* → **Handler = `index.handler`**.
6. *Configuration → General* → **Timeout ≈ 30 s** (acorde a `API_TIMEOUT`).
7. *Configuration → Environment variables* (ver tabla abajo).
8. *Configuration → Function URL* → *Create* → **Auth type: NONE** (el control de acceso lo hace
   la sesión del panel). Copia la URL, p. ej. `https://abcd1234.lambda-url.us-east-1.on.aws/`.

### Variables de entorno de la función Lambda

| Variable | Valor | Notas |
|---|---|---|
| `API_BASE` | `https://tecomnet.net/Inventario/api` | Base de la API de Inventario a la que el BFF hace proxy. |
| `API_TIMEOUT` | `30` | Segundos. |
| `SESSION_SECRET` | *(secreto largo aleatorio)* | Firma la cookie de sesión. **Obligatorio en prod.** |
| `SESSION_TIMEOUT` | `600` | Inactividad de sesión (segundos). |
| `AUTH_MODE` | `placeholder` | `placeholder` = login abierto (aún sin auth). Cambia a `api` cuando exista. |
| `AUTH_LOGIN_PATH` | `/Auth/Login` | Solo se usa con `AUTH_MODE=api`. |
| `NODE_ENV` | `production` | Hace obligatorio `SESSION_SECRET`. |

Genera el `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## 3) Conectar `/api/*` del front con el Lambda (rewrites de Amplify)

Consola de Amplify → tu app → *Hosting → Rewrites and redirects*. Agrega **en este orden**
(la regla de `/api` debe ir ANTES que la de la SPA):

| # | Source address | Target address | Type |
|---|---|---|---|
| 1 | `/api/<*>` | `https://<tu-function-url>/api/<*>` | `200 (Rewrite)` |
| 2 | `/<*>` | `/index.html` | `200 (Rewrite)` |

- Regla 1: reenvía las llamadas del BFF al Lambda (proxy inverso, mismo origen para el navegador).
- Regla 2: hace que el routing de React (recargar `/productos`, etc.) devuelva siempre `index.html`.

## 4) Notas de sesión / cookies

- La sesión del panel es una **cookie httpOnly** que emite el BFF. Como el rewrite es **200 (proxy),
  no 301/302**, el navegador ve el **origen de Amplify** y la cookie viaja de vuelta. Por eso debe ser *Rewrite*.
- La cookie usa `Secure` + `SameSite=Lax`; Amplify sirve por HTTPS.

## 5) Auto-deploy en cada push

- **Front:** Amplify ya redepliega solo al hacer push a la rama conectada (no requiere Action).
- **Lambda:** el repo incluye [`.github/workflows/deploy-lambda.yml`](./.github/workflows/deploy-lambda.yml),
  que en cada push que toque `server/` recompila el bundle y actualiza la función con la AWS CLI.
  Configura estos **Secrets** en GitHub (Settings → Secrets and variables → Actions):

  | Secret | Valor |
  |---|---|
  | `AWS_ACCESS_KEY_ID` | clave de un usuario IAM con permiso `lambda:UpdateFunctionCode` |
  | `AWS_SECRET_ACCESS_KEY` | su secreto |
  | `AWS_REGION` | p. ej. `us-east-1` |
  | `LAMBDA_FUNCTION_NAME` | p. ej. `inventario-bff` |

## Costo aproximado
Tráfico de panel interno = muy bajo. Amplify Hosting y Lambda + Function URL caen prácticamente en
**free tier**; sin API Gateway no hay cargo por request de ese lado.
