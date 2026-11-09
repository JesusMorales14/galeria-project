/**
 * Lighthouse CI: mide en cada PR y hace fallar el build si se rompe un presupuesto.
 * Se mide contra la API simulada para que el resultado dependa de nuestro código,
 * no de la velocidad del servidor del museo en ese momento.
 */
const shared = {
  "cumulative-layout-shift": ["error", { maxNumericValue: 0.02 }],
  "total-blocking-time": ["error", { maxNumericValue: 300 }],
  "resource-summary:script:size": ["error", { maxNumericValue: 200 * 1024 }],
  "categories:accessibility": ["error", { minScore: 0.95 }],
  "categories:seo": ["error", { minScore: 0.9 }],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: "node scripts/start-with-mock.mjs",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/buscar?q=monet",
        "http://localhost:3000/obra/27992",
      ],
      numberOfRuns: 3,
      settings: { disableFullPageScreenshot: true, chromeFlags: "--no-sandbox --headless=new" },
    },
    assert: {
      assertMatrix: [
        {
          // Portada: Chrome headless precarga todas las imágenes diferidas (umbral de 3000 px),
          // así que la simulación reparte el ancho de banda entre 7 imágenes. Presupuesto más amplio.
          matchingUrlPattern: "http://[^/]+/$",
          assertions: {
            ...shared,
            "largest-contentful-paint": ["error", { maxNumericValue: 6500 }],
          },
        },
        {
          matchingUrlPattern: "/(buscar|obra)",
          assertions: {
            ...shared,
            "largest-contentful-paint": ["error", { maxNumericValue: 4000 }],
            "categories:performance": ["error", { minScore: 0.85 }],
          },
        },
      ],
    },
    upload: { target: "temporary-public-storage" },
  },
};
