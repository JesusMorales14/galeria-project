// Servidor que simula la API del Art Institute para desarrollo sin red, build local y e2e.
// Uso: node e2e/mock-aic/server.mjs  (puerto MOCK_AIC_PORT, 4010 por defecto)
import { createServer } from "node:http";
import { ARTWORKS, NOT_FOUND_ID } from "./dataset.mjs";
import { renderImage } from "./images.mjs";
import { search } from "./search.mjs";

const PORT = Number(process.env.MOCK_AIC_PORT ?? 4010);
const ORIGIN = `http://localhost:${PORT}`;
const config = { iiif_url: `${ORIGIN}/iiif/2`, website_url: ORIGIN };
const byId = new Map(ARTWORKS.map((artwork) => [artwork.id, artwork]));

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

async function image(res, imageId, width) {
  const artwork = ARTWORKS.find((item) => item.image_id === imageId);
  const ratio = artwork ? artwork.thumbnail.height / artwork.thumbnail.width : 0.75;
  const tone = imageId.split("-").at(-1) ?? "8a7a5c";
  const { type, body } = await renderImage(width, Math.round(width * ratio), tone);
  res.writeHead(200, { "Content-Type": type, "Cache-Control": "public, max-age=86400" });
  res.end(body);
}

function handleSearch(res, url) {
  const body = JSON.parse(url.searchParams.get("params") ?? "{}");
  const result = search(ARTWORKS, body);
  json(res, 200, {
    pagination: {
      total: result.total,
      limit: result.size,
      offset: result.from,
      total_pages: Math.ceil(result.total / result.size),
    },
    data: result.data,
    config,
  });
}

function handleArtwork(res, id) {
  const artwork = byId.get(id);
  if (!artwork || id === NOT_FOUND_ID) return json(res, 404, { status: 404, error: "Not found" });
  return json(res, 200, { data: artwork, config });
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", ORIGIN);
  const iiif = url.pathname.match(/^\/iiif\/2\/([^/]+)\/full\/(\d+),\/0\/default\.jpg$/);
  if (iiif) return image(res, iiif[1], Number(iiif[2]));
  if (url.pathname === "/api/v1/artworks/search") return handleSearch(res, url);
  if (url.pathname === "/api/v1/artworks") {
    const ids = (url.searchParams.get("ids") ?? "").split(",").map(Number);
    return json(res, 200, { data: ids.flatMap((id) => byId.get(id) ?? []), config });
  }
  const single = url.pathname.match(/^\/api\/v1\/artworks\/(\d+)$/);
  if (single) return handleArtwork(res, Number(single[1]));
  return json(res, 404, { error: "Not found" });
}).listen(PORT, () => console.log(`API simulada del museo en ${ORIGIN}/api/v1`));
