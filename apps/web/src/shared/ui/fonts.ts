import localFont from "next/font/local";

/*
 * Fuentes servidas desde el propio sitio (sin peticiones a Google en el build ni en el navegador).
 * next/font genera un fallback con métricas ajustadas: el texto no salta al cargar la fuente (CLS).
 */

/** Big Shoulders: tipografía cívica de Chicago. Rótulos, navegación, controles y cartelas. */
export const bigShoulders = localFont({
  // El archivo «standard» incluye los ejes de peso y tamaño óptico (rótulo ↔ texto).
  src: "../../../node_modules/@fontsource-variable/big-shoulders/files/big-shoulders-latin-standard-normal.woff2",
  weight: "100 900",
  variable: "--font-shoulders",
  display: "swap",
  fallback: ["Arial Narrow", "Roboto Condensed", "sans-serif"],
});

/** Newsreader: lectura y títulos de obra (en cursiva, como en una cartela). */
export const newsreader = localFont({
  src: [
    {
      path: "../../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  weight: "200 800",
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});
