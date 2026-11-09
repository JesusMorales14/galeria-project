/**
 * Imágenes de la API simulada: JPEG con ruido, cuyo peso crece con el ancho pedido
 * como en el servidor IIIF real. Así las mediciones locales de LCP y bytes significan algo.
 * Si sharp no está instalado, se sirve un SVG plano.
 */
const cache = new Map();
let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  sharp = null;
}

function hexToRgb(hex) {
  const value = Number.parseInt(hex, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

async function noisyJpeg(width, height, tone) {
  const [r, g, b] = hexToRgb(tone);
  const pixels = Buffer.alloc(width * height * 3);
  for (let i = 0; i < pixels.length; i += 3) {
    const n = (Math.random() - 0.5) * 70;
    pixels[i] = Math.max(0, Math.min(255, r + n));
    pixels[i + 1] = Math.max(0, Math.min(255, g + n));
    pixels[i + 2] = Math.max(0, Math.min(255, b + n));
  }
  return sharp(pixels, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 82 })
    .toBuffer();
}

export async function renderImage(width, height, tone) {
  if (!sharp) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#${tone}"/></svg>`;
    return { type: "image/svg+xml", body: svg };
  }
  const key = `${width}x${height}-${tone}`;
  if (!cache.has(key)) cache.set(key, await noisyJpeg(width, height, tone));
  return { type: "image/jpeg", body: cache.get(key) };
}
