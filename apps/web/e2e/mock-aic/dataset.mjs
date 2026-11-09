/**
 * Datos del servidor simulado. Las 7 primeras son obras reales de dominio público
 * del Art Institute (las destacadas de la portada); el resto son obras de prueba
 * con artistas ficticios, claramente marcadas, para tener volumen en búsqueda y paginación.
 */
const featured = [
  [27992, "A Sunday on La Grande Jatte — 1884", "Georges Seurat", "1884–86", 1884, 3000, 2013],
  [28560, "The Bedroom", "Vincent van Gogh", "1889", 1889, 3000, 2361],
  [20684, "Paris Street; Rainy Day", "Gustave Caillebotte", "1877", 1877, 3000, 2513],
  [14598, "The Child's Bath", "Mary Cassatt", "1893", 1893, 2400, 3000],
  [16568, "Water Lilies", "Claude Monet", "1906", 1906, 3000, 2856],
  [64818, "Stacks of Wheat (End of Summer)", "Claude Monet", "1890–91", 1890, 3000, 1800],
  [
    16571,
    "Arrival of the Normandy Train, Gare Saint-Lazare",
    "Claude Monet",
    "1877",
    1877,
    3000,
    2276,
  ],
];

const TYPES = ["Painting", "Print", "Drawing and Watercolor", "Photograph", "Sculpture", "Textile"];
const TONES = ["8a7a5c", "6b5b4b", "7d8a6a", "5f6670", "9a6b50", "4f5a4a"];

function artwork([id, title, artist, dateDisplay, dateStart, width, height], index) {
  return {
    id,
    title,
    artist_title: artist,
    artist_display: artist,
    date_display: dateDisplay,
    date_start: dateStart,
    date_end: dateStart,
    image_id: `mock-${id}-${TONES[index % TONES.length]}`,
    thumbnail: { lqip: null, width, height, alt_text: null },
    is_public_domain: true,
    artwork_type_title: index < featured.length ? "Painting" : TYPES[index % TYPES.length],
    medium_display: index < featured.length ? "Oil on canvas" : "Técnica de prueba",
    dimensions: "100 × 80 cm",
    place_of_origin: "France",
    description: index < featured.length ? null : "<p>Obra de prueba del servidor simulado.</p>",
    short_description: null,
    credit_line: "Datos de prueba",
    department_title: "Painting and Sculpture of Europe",
    style_title: null,
  };
}

const generated = Array.from({ length: 53 }, (_, i) => {
  const year = 1450 + ((i * 37) % 560);
  const portrait = i % 3 === 0;
  return [
    900000 + i,
    `Obra de prueba ${i + 1}`,
    `Artista de prueba ${(i % 9) + 1}`,
    String(year),
    year,
    portrait ? 2400 : 3000,
    portrait ? 3000 : 2200,
  ];
});

export const ARTWORKS = [...featured, ...generated].map(artwork);
export const NOT_FOUND_ID = 999999;
