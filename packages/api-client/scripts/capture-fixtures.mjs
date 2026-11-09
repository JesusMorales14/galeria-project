// Guarda respuestas reales de la API en test/fixtures/captured/ para compararlas
// con los fixtures de los tests. Uso: pnpm --filter @galeria/api-client fixtures:capture
import { mkdir, writeFile } from "node:fs/promises";

const BASE = "https://api.artic.edu/api/v1";
const HEADERS = { "AIC-User-Agent": "galeria (fixtures)" };
const OUT = new URL("../test/fixtures/captured/", import.meta.url);

const requests = {
  "artwork-complete": "/artworks/27992",
  "search-results": `/artworks/search?params=${encodeURIComponent(
    JSON.stringify({
      q: "seurat",
      size: 3,
      query: { bool: { filter: [{ term: { is_public_domain: true } }] } },
    }),
  )}&fields=id,title,artist_title,date_display,artwork_type_title,image_id,thumbnail`,
  "error-not-found": "/artworks/1",
};

await mkdir(OUT, { recursive: true });
for (const [name, path] of Object.entries(requests)) {
  const response = await fetch(`${BASE}${path}`, { headers: HEADERS });
  const body = await response.json();
  await writeFile(new URL(`${name}.json`, OUT), JSON.stringify(body, null, 2));
  console.log(`${response.status} ${name}`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // máximo 1 petición por segundo
}
