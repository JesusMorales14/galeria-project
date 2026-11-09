/** Datos de identidad del sitio. Única fuente para metadatos, layout y textos globales. */
export const siteConfig = {
  name: "Galería",
  locale: "es",
  description:
    "Explora la colección del Art Institute of Chicago: busca obras, míralas en alta resolución y guarda tus favoritas.",
} as const;

export type SiteConfig = typeof siteConfig;
