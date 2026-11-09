# 0001 · Monorepo con pnpm workspaces y Turborepo

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

El proyecto tiene tres piezas con responsabilidades distintas: la app Next.js, un design system y la integración con la API del museo. El objetivo era que esa separación fuera **visible y comprobable**, no solo una convención de carpetas.

## Opciones consideradas

1. **Una sola app** con carpetas `components/` y `lib/`: simple, pero nada impide que un componente importe el cliente HTTP.
2. **Monorepo con pnpm workspaces + Turborepo:** cada pieza es un paquete con su `package.json`, sus dependencias y su API pública (`src/index.ts`).
3. **Nx:** más funciones (generadores, grafo), pero también más configuración de la que necesita un proyecto de este tamaño.

## Decisión

pnpm workspaces + Turborepo, con `apps/web`, `packages/ui`, `packages/api-client` y `packages/config`.

## Consecuencias

- `ui` no depende de Next.js ni de la API; `api-client` no depende de React. Las dependencias entre paquetes están declaradas en cada `package.json`.
- La configuración (TypeScript estricto, ESLint con reglas de accesibilidad y de tamaño de archivo, Prettier) está en un solo sitio.
- Turborepo cachea `lint`, `typecheck`, `test` y `build` por paquete: solo se repite lo que cambió.
- **Coste:** un poco más de configuración inicial, y Vercel necesita Root Directory = `apps/web`.
