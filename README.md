# Galería

Explorador de la colección del [Art Institute of Chicago](https://api.artic.edu/docs), hecho con Next.js, React y TypeScript, sin backend propio.

> Proyecto en construcción por fases. Ver `docs/superpowers/plans/` para el plan de cada fase.

## Requisitos

- Node.js 22 o superior
- pnpm 12 (`npm install -g pnpm`)

## Cómo empezar

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Scripts

| Comando          | Qué hace                                                       |
| ---------------- | -------------------------------------------------------------- |
| `pnpm dev`       | Arranca la app en modo desarrollo                              |
| `pnpm build`     | Compila todos los paquetes                                     |
| `pnpm lint`      | ESLint (accesibilidad, límites entre capas, tamaño de archivo) |
| `pnpm typecheck` | Comprueba los tipos con TypeScript                             |
| `pnpm test`      | Tests con Vitest                                               |
| `pnpm format`    | Formatea el código con Prettier                                |

Turborepo ejecuta cada tarea solo en los paquetes que cambiaron y guarda el resultado en caché.

## Estructura

```text
apps/web/              App Next.js (rutas y composición)
packages/ui/           Design system (Fase 3)
packages/api-client/   Integración tipada con la API del museo (Fase 2)
packages/config/       TypeScript, ESLint y Prettier compartidos
docs/                  Arquitectura, ADRs y planes por fase
```

Las reglas de arquitectura están en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
