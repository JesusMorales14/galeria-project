# Cómo trabajar en Galería

## Requisitos

- Node.js 22 y pnpm 12 (`npm install -g pnpm`).
- `pnpm install` en la raíz.

## Ramas y commits

- Una rama por cambio: `fase-N-tema`, `fix/tema` o `feat/tema`, desde `main`.
- Commits pequeños con [Conventional Commits](https://www.conventionalcommits.org/es/): `feat(search): …`, `fix(collections): …`, `docs: …`, `test: …`, `perf: …`, `chore: …`.
- Mensajes en español, en imperativo, explicando el _por qué_ cuando no sea obvio.

## Antes de abrir un PR

```bash
pnpm verify          # formato, lint, tipos y tests con umbral de cobertura
pnpm build           # (apps/web necesita la API; ver abajo)
pnpm --filter @galeria/web test:e2e   # Playwright + axe contra la API simulada
```

Para compilar o probar sin red, arranca la API simulada:

```bash
pnpm --filter @galeria/web mock:api          # http://localhost:4010/api/v1
AIC_API_BASE_URL=http://localhost:4010/api/v1 pnpm build
```

## Reglas que el CI hace cumplir

- **Arquitectura:** `app → features → shared`; cada feature se importa solo por su `index.ts` (ver `docs/ARCHITECTURE.md`).
- **Tamaño:** archivos ≤ 150 líneas, funciones ≤ 60 y complejidad ≤ 10. Si salta, extrae un componente, un hook o una función.
- **Accesibilidad:** `jsx-a11y` en lint, axe en tests de componentes, en Storybook y en e2e.
- **Cobertura:** ≥ 80 % de líneas, funciones y sentencias; ≥ 75 % de ramas.
- **Rendimiento:** presupuestos de Lighthouse CI (CLS, LCP, TBT, JavaScript ≤ 200 KB).

## Decisiones

Una decisión técnica relevante = un ADR en `docs/adr/` con la plantilla `0000-plantilla.md`.

## Pull requests

Usa la plantilla (`.github/pull_request_template.md`): qué cambia, por qué, cómo se probó, accesibilidad y capturas si hay interfaz.
