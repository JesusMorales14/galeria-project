# @galeria/ui

Design system de Galería: tokens y componentes presentacionales. **No sabe de dónde vienen los datos ni qué router se usa**: recibe todo por props (las imágenes como `media`, los enlaces del router con `linkComponent` o `asChild`).

Dirección visual y reglas: [`DESIGN.md`](../../DESIGN.md).

## Componentes

| Componente                        | Para qué                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `Button`                          | Acciones. Variantes `primary`, `secondary`, `ghost`; estado `loading`.                      |
| `TextLink`                        | Enlaces de texto. `external` abre en otra pestaña y lo anuncia; `asChild` para `next/link`. |
| `ArtworkCard`                     | Obra en cuadrícula con su cartela. Enlace estirado, nombrado por el título.                 |
| `Skeleton`, `ArtworkCardSkeleton` | Carga, reservando la proporción de la imagen.                                               |
| `EmptyState`, `ErrorState`        | Estados vacío y de error, con salida concreta.                                              |
| `VisuallyHidden`, `LiveRegion`    | Texto solo para lectores de pantalla y anuncios `aria-live`.                                |

## Tokens

`src/styles/tokens.css` define variables CSS (modo claro y oscuro) y las expone a Tailwind con `@theme`: `bg-wall`, `text-ink`, `text-ink-muted`, `border-line`, `text-accent`, `font-display`, `text-display`, `text-title`, `text-label`… La app los importa con `@import "@galeria/ui/styles.css"`.

## Storybook

```bash
pnpm --filter @galeria/ui storybook         # http://localhost:6006
pnpm --filter @galeria/ui build-storybook   # genera storybook-static/
```

Cada historia pasa por el addon de accesibilidad (`parameters.a11y.test = "error"`).

**Despliegue en Vercel:** crea un segundo proyecto desde el mismo repositorio con Root Directory `packages/ui`, Build Command `pnpm build-storybook` y Output Directory `storybook-static`.

## Tests

Testing Library + axe en cada componente: se prueba lo que el usuario ve y hace.
