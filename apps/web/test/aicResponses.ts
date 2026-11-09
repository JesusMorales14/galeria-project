/** Respuestas de la API del museo para tests de integración de la app. */
export function searchResponse(count: number, total: number) {
  return {
    pagination: { total, limit: 24, offset: 0, total_pages: Math.ceil(total / 24) },
    data: Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      title: `Obra ${index + 1}`,
      artist_title: "Claude Monet",
      date_display: "1890",
      artwork_type_title: "Painting",
      image_id: `img-${index + 1}`,
      thumbnail: { lqip: null, width: 1000, height: 800, alt_text: null },
    })),
    config: { iiif_url: "https://www.artic.edu/iiif/2" },
  };
}

export function artworkResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      id: 28560,
      title: "The Bedroom",
      artist_title: "Vincent van Gogh",
      artist_display: "Vincent van Gogh\nDutch, 1853–1890",
      date_display: "1889",
      date_start: 1889,
      date_end: 1889,
      artwork_type_title: "Painting",
      image_id: "img-bedroom",
      thumbnail: { lqip: null, width: 3000, height: 2361, alt_text: null },
      is_public_domain: true,
      medium_display: "Oil on canvas",
      dimensions: "73.6 × 92.3 cm",
      place_of_origin: "Saint-Rémy",
      description: "<p>Van Gogh painted his bedroom.</p>",
      ...overrides,
    },
    config: { iiif_url: "https://www.artic.edu/iiif/2" },
  };
}
