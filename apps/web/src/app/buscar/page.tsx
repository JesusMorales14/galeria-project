import type { Metadata } from "next";
import { SearchFormSection, SearchResultsSection } from "@/features/search";

export const metadata: Metadata = {
  title: "Buscar obras",
  description:
    "Busca obras de dominio público del Art Institute of Chicago por texto, tipo, época y artista.",
};

/**
 * Renderizado bloqueante a propósito (sin Suspense ni loading.tsx): la respuesta lleva el HTML
 * completo con formulario y resultados, así la búsqueda funciona también sin JavaScript.
 * Con streaming, el contenido tardío llega oculto y lo revela un <script>. Los datos están
 * cacheados (cacheLife "hours"), así que la espera es corta. Ver docs/adr/0008.
 */
export const instant = false;

export default function SearchPage({ searchParams }: PageProps<"/buscar">) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-display">Buscar obras</h1>
      <SearchFormSection searchParams={searchParams} />
      <SearchResultsSection searchParams={searchParams} />
    </main>
  );
}
