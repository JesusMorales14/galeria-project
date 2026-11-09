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
