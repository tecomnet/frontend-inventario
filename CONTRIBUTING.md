# Guía de contribución — Inventario Tecomnet (panel web)

Este repositorio está ligado al proyecto de Jira **KL — Inventario Tecomnet**:
https://desarrollotecomnet-1785873095276.atlassian.net/jira/software/projects/KL/boards/8

Todo el trabajo arranca de un issue de Jira. La clave del issue (`KL-123`) es el
hilo que conecta la tarjeta del tablero con la rama, los commits y el PR.

Las convenciones son las mismas que en la API
([tecomnet/inventario](https://github.com/tecomnet/inventario)).

## 1. Instalación de los hooks (una sola vez por clon)

`npm install` los activa solo (script `prepare`). Si no, a mano:

```bash
git config core.hooksPath .githooks
```

En Windows, si los hooks no se ejecutan, márcalos como ejecutables:

```bash
git update-index --chmod=+x .githooks/commit-msg .githooks/prepare-commit-msg
```

Con esto:

- `prepare-commit-msg` antepone automáticamente la clave `KL-###` tomándola del
  nombre de la rama, así que casi nunca tienes que escribirla a mano.
- `commit-msg` rechaza cualquier commit que no referencie un issue.

El workflow [`jira-convention.yml`](.github/workflows/jira-convention.yml) repite
la validación en cada PR (título y todos sus commits), así que un commit hecho
sin hooks o con `--no-verify` también se detecta.

## 2. Flujo de trabajo

`main` está protegida: **no acepta push directo**. Todo cambio entra por PR.

1. Toma o crea el issue en Jira.
2. Crea la rama desde `main` actualizado (formato en la sección 3).
3. Haz commits con la clave del issue (sección 4).
4. Antes de subir, corre `npm run lint` y `npm run build`.
5. Sube la rama y abre el PR hacia `main` (sección 5).
6. Otra persona revisa y aprueba; entonces se mergea y se mueve la tarjeta.

Recuerda que cada push a `main` despliega: Amplify publica el front y
[`deploy-lambda.yml`](.github/workflows/deploy-lambda.yml) actualiza el BFF si
cambió `server/`.

## 3. Nombre de ramas

```
<tipo>/KL-<número>-<descripción-corta-en-kebab-case>
```

`<tipo>` es uno de: `feature`, `fix`, `hotfix`, `refactor`, `chore`, `docs`.

```
feature/KL-62-permisos-por-rol
fix/KL-57-auth-login-bff
chore/KL-64-convenciones-repo
```

```bash
git switch main
git pull
git switch -c feature/KL-62-permisos-por-rol
```

Si tu issue depende de otro que aún no está en `main`, saca la rama de la rama
de ese issue y dilo en el PR.

## 4. Mensajes de commit

```
KL-<número>: <descripción breve en imperativo>
```

```
KL-57: agrega login contra la API real
KL-60: migra los listados a la respuesta paginada de la API
KL-64: agrega hooks y workflow de la convención de Jira
```

Reglas:

- Primera línea ≤ 72 caracteres, en imperativo y sin punto final.
- Sin prefijos tipo `feat:` / `fix:`: el tipo ya va en el nombre de la rama.
- Sin fechas ni iniciales en el mensaje: eso ya lo guarda git en el autor y la
  fecha del commit.
- Un commit toca un solo issue. Si el cambio abarca dos tarjetas, son dos commits.
- El cuerpo del commit (opcional, tras una línea en blanco) explica el *por qué*.

Los commits de merge, `revert` y `fixup!`/`squash!` están exentos de la validación.
Para saltar el hook en un caso puntual existe `git commit --no-verify`, pero el
CI rechazará el PR igual.

## 5. Pull Requests y revisión

- Título del PR: `KL-57: agrega login contra la API real` (misma forma que el commit).
- Rellena la plantilla del PR: enlaza el issue y describe cómo se probó
  (pantallas, rol del usuario, endpoints).
- Para mergear hacen falta el check **Convención Jira** en verde y la aprobación
  de otra persona.
- Quien revisa comprueba que el cambio hace lo que pide el issue, que no rompe
  otras pantallas y que el README sigue describiendo el estado actual.

## 6. Formato del código

- [`.editorconfig`](.editorconfig) fija lo básico (UTF-8, LF, 2 espacios).
- [Prettier](.prettierrc.json) formatea; ESLint no pelea con él
  (`eslint-config-prettier`).
- Formatea **solo los archivos que tocas**:

  ```bash
  npm run format -- src/pages/Marcas.tsx server/app.ts
  ```

  No corras Prettier sobre todo el repositorio en un PR de funcionalidad: el
  diff se llenaría de cambios de formato y chocaría con las demás ramas.

## 7. Smart commits (opcional, requiere la app GitHub for Jira)

Si algún día se instala la app **GitHub for Jira**, estos comandos dentro del
mensaje de commit actúan sobre el issue automáticamente:

```
KL-57: agrega login contra la API real #comment listo para revisión
KL-57: agrega login contra la API real #time 2h #done
```

Sin esa app instalada la clave sigue siendo útil (rastreabilidad y búsqueda),
pero Jira no mostrará ramas ni commits en el panel de Desarrollo del issue.
