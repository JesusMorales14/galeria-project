/**
 * Límites entre capas de apps/web (ver docs/ARCHITECTURE.md):
 *   app/ → features/ → shared/
 * - Una feature solo se consume por su index.ts (API pública).
 * - shared/ no conoce ninguna feature.
 * - Nadie fuera de app/ importa rutas de Next.js.
 */
const featureDeepImport = {
  group: ["@/features/*/*", "@/features/*/*/**"],
  message: "Importa la feature por su API pública: '@/features/<nombre>'.",
};

const appImport = {
  group: ["@/app", "@/app/**"],
  message: "app/ solo contiene rutas. Mueve el código reutilizable a features/ o shared/.",
};

export const layerBoundaryRules = [
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [featureDeepImport, appImport] }],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            appImport,
            {
              group: ["@/features", "@/features/**"],
              message: "shared/ no puede depender de features/.",
            },
          ],
        },
      ],
    },
  },
];
