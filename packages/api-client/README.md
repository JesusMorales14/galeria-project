# @galeria/api-client

Integración tipada con la [API del Art Institute of Chicago](https://api.artic.edu/docs). No sabe nada de React ni de Next.js.

## Uso

```ts
import { createAicClient, buildImageUrl } from "@galeria/api-client";

const aic = createAicClient({ userAgent: "galeria (https://github.com/…)" });

const result = await aic.searchArtworks({ q: "monet", page: 1, pageSize: 24 });
const artwork = await aic.getArtwork(27992); // null si no existe
const image = artwork?.image && buildImageUrl(artwork.image, 843);
```

## Cómo se protege de una API que cambia

1. **Contrato con Zod** (`src/aic/schemas.ts`): solo `id` y `title` son obligatorios. El resto puede faltar sin romper nada.
2. **Normalización** (`src/aic/normalizeArtwork.ts`): la respuesta se convierte a tipos propios (`Artwork`, `ArtworkSummary`). La interfaz nunca ve `artist_title` ni `image_id`.
3. **Listas tolerantes** (`src/aic/parseList.ts`): cada registro se valida por separado; uno roto se descarta y el resto se muestra.
4. **Errores tipados** (`src/errors.ts`): `AicRateLimitError` (429), `AicApiError` (otros estados), `AicContractError` (la forma cambió). Un 404 devuelve `null`.

## Decisiones

- **Solo dominio público.** Toda búsqueda filtra `is_public_domain=true` y obras con imagen: es lo más seguro para mostrar las imágenes y evita resultados vacíos.
- **Búsqueda por GET con `params`.** Es lo que recomienda el museo para producción y permite cachear la respuesta.
- **`fields` explícitos.** Se piden solo los campos que usa la interfaz: respuestas más ligeras.
- **La base IIIF se lee de `config.iiif_url`** en cada respuesta, nunca está escrita en el código.
- **`fetch` inyectable**, resuelto en cada llamada: permite tests con MSW y la instrumentación de Sentry.

## Tests

```bash
pnpm --filter @galeria/api-client test
pnpm --filter @galeria/api-client fixtures:capture   # compara con respuestas reales
```
