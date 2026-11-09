import baseConfig from "@galeria/config/prettier";

/** @type {import("prettier").Config} */
export default {
  ...baseConfig,
  // Tailwind v4 necesita saber qué hoja de estilos define el tema.
  tailwindStylesheet: "./apps/web/src/app/globals.css",
};
