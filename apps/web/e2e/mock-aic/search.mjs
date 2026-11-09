/** Interpreta el subconjunto del cuerpo Elasticsearch que envía @galeria/api-client. */
function includes(value, query) {
  return String(value ?? "")
    .toLowerCase()
    .includes(String(query).toLowerCase());
}

function passesFilter(artwork, filter) {
  if (filter.match) {
    const [field, { query }] = Object.entries(filter.match)[0];
    return includes(artwork[field], query);
  }
  if (filter.range) {
    const { gte, lte } = filter.range.date_start;
    return artwork.date_start >= gte && artwork.date_start <= lte;
  }
  return true; // term is_public_domain / exists image_id: todo el dataset cumple
}

function sortBy(items, sort) {
  const direction = sort?.[0]?.date_start;
  if (!direction) return items;
  const factor = direction === "asc" ? 1 : -1;
  return [...items].sort((a, b) => (a.date_start - b.date_start) * factor);
}

export function search(artworks, body) {
  const filters = body.query?.bool?.filter ?? [];
  const matches = artworks.filter(
    (artwork) =>
      (!body.q || includes(artwork.title, body.q) || includes(artwork.artist_title, body.q)) &&
      filters.every((filter) => passesFilter(artwork, filter)),
  );
  const from = body.from ?? 0;
  const size = body.size ?? 10;
  return {
    total: matches.length,
    from,
    size,
    data: sortBy(matches, body.sort).slice(from, from + size),
  };
}
