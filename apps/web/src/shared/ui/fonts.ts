import localFont from "next/font/local";

/*
 * Fuentes servidas desde el propio sitio (sin peticiones a Google en el build ni en el navegador).
 * next/font genera un fallback con métricas ajustadas: el texto no salta al cargar la fuente (CLS).
 */
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

export const instrumentSans = localFont({
  src: "../../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
  weight: "400 700",
  variable: "--font-instrument",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
