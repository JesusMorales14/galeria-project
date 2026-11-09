# Plan · Fase 1 · Monorepo y herramientas base

> Estado: **aprobado y ejecutado** (2026-11-09).
> Rama de trabajo: `fase-1-monorepo` (sale de `main`).

## 1. Especificación (resultado del brainstorming)

### Punto de partida

- App creada con `create-next-app` en la **raíz** del repo: Next.js 16.4.5, React 19.3, TypeScript `strict`, ESLint 9 (flat config), **Tailwind v4** (vía `@tailwindcss/turbopack`), `cacheComponents` y `partialPrefetching` activos.
- Gestor: **npm** (`package-lock.json`). pnpm no está instalado en tu equipo.
- Git: un solo commit (`Initial commit from Create Next App`), **sin remoto** en GitHub.

### Decisiones tomadas contigo

| Tema       | Decisión                                                          | Por qué                                                                          |
| ---------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Alcance    | Solo Fase 1                                                       | La guía pide cerrar cada fase antes de seguir.                                   |
| Estructura | Mover la app a `apps/web` con `git mv`                            | Conserva el historial de cada archivo y deja sitio a `packages/*`.               |
| Gestor     | pnpm 12.18.0 (instalado con `npm install -g pnpm`) + Turborepo    | Workspaces estrictos y caché de tareas.                                          |
| Estilos    | **Se mantiene Tailwind**                                          | Decisión tuya. Ver "Consecuencias" abajo.                                        |
| Skills     | Reinstalar `obra/superpowers` y `pbakaus/impeccable` desde GitHub | No hay acceso a tu portfolio. Las versiones pueden diferir de las que usas allí. |

### Consecuencias de mantener Tailwind (para que lo decidas con los ojos abiertos)

- La guía asume CSS Modules + Sass + BEM en la Fase 3 y el ADR 5 dice "en lugar de Tailwind". Habrá que **reescribir ese ADR** ("Tailwind v4 con tokens en `@theme`") y ajustar la Fase 3.
- Pierdes evidencia directa del deseable "CSS Modules, SASS, BEM" de la oferta; ganas el de Tailwind si la oferta lo valora.
- Técnico: cuando exista `packages/ui`, Tailwind necesitará una directiva `@source` apuntando a ese paquete para generar sus clases. Lo dejo anotado para la Fase 3.

### Estructura final

```text
galeria/
├── apps/web/                 # la app actual, movida
├── packages/
│   ├── config/               # tsconfig, ESLint y Prettier compartidos
│   ├── ui/                   # esqueleto vacío (se llena en Fase 3)
│   └── api-client/           # esqueleto vacío (se llena en Fase 2)
├── docs/{adr,superpowers/plans}/
├── .agents/ + skills-lock.json
├── .github/workflows/ci.yml
├── PRODUCT.md
├── package.json · pnpm-workspace.yaml · turbo.json · vitest.config.ts
```

### Arquitectura por componentes (añadido al aprobar)

Requisito: archivos pequeños, escalable y mantenible. Se hace cumplir con ESLint, no con buena voluntad:

- `max-lines` 150 por archivo, `max-lines-per-function` 60, `complexity` 10, `max-depth` 3, `max-params` 3.
- Capas `app → features → shared` dentro de `apps/web/src`, con `no-restricted-imports`: cada feature se importa solo por su `index.ts` y `shared/` no conoce las features.
- Un componente por carpeta, presentación separada de datos. Detalle en `docs/ARCHITECTURE.md`.
- La app pasa a `apps/web/src/` para separar código de configuración.

## 2. Tareas

Cada tarea termina con una verificación concreta. Un commit por tarea (mensajes en convención `chore:`/`ci:`/`test:`).

### T1 · Rama y limpieza

- Crear la rama `fase-1-monorepo`.
- Comprobar que `.next/` y `node_modules/` están ignorados (ya lo están).
- **Verifica:** `git status` limpio en la rama nueva.

### T2 · Mover la app a `apps/web`

- `git mv` de `app/`, `public/`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `next-env.d.ts`, `AGENTS.md` y el `package.json` actual a `apps/web/`. El `package.json` se renombra a `"name": "@galeria/web"`.
- Eliminar `package-lock.json` (lo sustituye `pnpm-lock.yaml`). Te pediré permiso de borrado para esta carpeta: el acceso que tengo no borra archivos por defecto.
- **Verifica:** `git log --follow apps/web/app/page.tsx` muestra el commit inicial.

### T3 · pnpm workspaces + Turborepo

- `package.json` raíz: `private`, `packageManager: "pnpm@<versión exacta>"`, `engines.node: ">=22"`, scripts `dev`, `build`, `lint`, `typecheck`, `test`, `format` que delegan en `turbo run …`.
- `pnpm-workspace.yaml` con `apps/*` y `packages/*`.
- `turbo.json` con tareas `build` (outputs `.next/**`, excluyendo `.next/cache/**`), `lint`, `typecheck`, `test` y `dev` (`persistent`, sin caché).
- Next detecta la raíz del monorepo por `pnpm-lock.yaml` (documentado en `node_modules/next/dist/docs/…/turbopack.md`), así que no hace falta `turbopack.root`.
- **Verifica:** `pnpm install` sin errores y `pnpm build` genera la app.

### T4 · `packages/config`

- `tsconfig/base.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`, `moduleResolution: "bundler"`.
- `tsconfig/nextjs.json` que extiende la base con lo de Next (plugin `next`, `jsx`, `allowJs`, `incremental`).
- `eslint/next.mjs`: la config actual de Next + reglas **recomendadas de `eslint-plugin-jsx-a11y`** (Next ya registra el plugin con pocas reglas; añado las del preset sin volver a registrarlo para evitar el error "Cannot redefine plugin") + `eslint-config-prettier` al final.
- `prettier/index.json` + `prettier-plugin-tailwindcss` (ordena las clases de Tailwind).
- `apps/web` extiende estas configs. Script `typecheck: tsc --noEmit` en cada paquete.
- **Verifica:** `pnpm lint` y `pnpm typecheck` pasan; un `<img>` sin `alt` de prueba **hace fallar** el lint (luego se quita).

### T5 · Esqueletos `packages/ui` y `packages/api-client`

- `package.json` (`@galeria/ui`, `@galeria/api-client`), `tsconfig.json`, `src/index.ts` vacío y un README de una línea que dice en qué fase se construyen.
- `apps/web` los declara como dependencia `workspace:*` para que la relación quede visible desde el día 1.
- **Verifica:** `pnpm typecheck` recorre los tres paquetes.

### T6 · Vitest (TDD de verdad, aunque sea trivial)

- `vitest.config.ts` raíz con `projects` por paquete (cada paquete podrá tener su entorno: `node` para api-client, `jsdom` para ui y web en fases posteriores).
- Primero un test que **falla**: `apps/web/lib/site.test.ts` espera que `siteConfig.name === "Galería"`. Luego el código mínimo (`lib/site.ts`), que la página "Hola" usa en su `<h1>` y en `metadata`.
- **Verifica:** se ve el test fallar en rojo y luego pasar en verde.

### T7 · Página "Hola"

- Sustituir la plantilla de create-next-app por una página mínima en español: `<main>` con `<h1>Galería</h1>` y una frase de qué será. `lang="es"` en `<html>`. Quitar los SVG de ejemplo de `public/`.
- **Verifica:** `pnpm build` muestra `/` como estática.

### T8 · CI en GitHub Actions

- `.github/workflows/ci.yml`: en cada `pull_request` y en `push` a `main`; `pnpm/action-setup` + `actions/setup-node` (Node 22, caché de pnpm), `pnpm install --frozen-lockfile`, `pnpm turbo run lint typecheck test build`.
- **Verifica:** el workflow corre en verde en el PR de esta fase.

### T9 · Skills y `PRODUCT.md`

- Instalar `obra/superpowers` y `pbakaus/impeccable` en `.agents/skills` y generar `skills-lock.json` (confirmo el comando exacto del instalador al ejecutarlo).
- Seguir el flujo de `impeccable init` para escribir `PRODUCT.md`. **Te haré 3–4 preguntas** (para quién es Galería, tono, qué no debe ser); el contenido lo decides tú.
- **Verifica:** existen `.agents/skills/*`, `skills-lock.json` y `PRODUCT.md`.

### T10 · Verificación final (`verification-before-completion`)

- Ejecutar y **leer la salida** de `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`.
- Actualizar el README raíz: qué es, requisitos, cómo arrancar (`corepack enable`, `pnpm install`, `pnpm dev`).

## 3. Pasos que tienes que hacer tú

Requieren tus cuentas; no puedo hacerlos desde aquí:

1. **Antes de T1:** `npm install -g pnpm` (Corepack falla sin permisos de administrador en Windows).
2. **Después de T10:** crear el repo en GitHub, `git remote add origin …`, `git push -u origin fase-1-monorepo` y abrir el PR (te dejo el texto).
3. **Vercel:** importar el repo con **Root Directory = `apps/web`** (Vercel detecta pnpm y Turborepo solo). Pegar la URL en el README.

## 4. Riesgos

- **`node_modules` de Windows:** el que tienes ahora es de npm. Haré las comprobaciones en una copia aislada del repo para no mezclar binarios Linux en tu carpeta; tú harás `pnpm install` en Windows al final. Si algo difiere entre ambos, CI decide.
- **Next 16 cambia rápido:** antes de tocar configuración leo la guía correspondiente en `node_modules/next/dist/docs/`, como pide `AGENTS.md`.
- **Versiones de las skills:** al reinstalar pueden no coincidir con las de tu portfolio. Quedan fijadas en `skills-lock.json`.

## 5. Criterio de terminado (de la guía)

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build` pasan en local y en CI.
- [ ] La app está desplegada en una URL de Vercel.
- [ ] Existe `PRODUCT.md`.

## 6. Para la entrevista

- **Por qué monorepo:** `ui` y `api-client` son paquetes con su propio `package.json`; la dependencia `web → ui` es explícita y comprobable. Turborepo cachea lo que no cambió.
- **Por qué `git mv`:** el historial de cada archivo sobrevive a la reestructuración.
- **Por qué `noUncheckedIndexedAccess`:** `array[0]` pasa a ser `T | undefined`; obliga a manejar listas vacías, que con datos de una API externa pasa a menudo.
