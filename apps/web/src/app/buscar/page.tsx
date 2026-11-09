import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchForm, SearchFormSection, SearchResultsSection } from "@/features/search";
import { ArtworkGridSkeleton } from "@/shared/artwork";

export const metadata: Metadata = {
  title: "Buscar obras",
  description:
    "Busca obras de dominio público del Art Institute of Chicago por texto, tipo, época y artista.",
};

export default function SearchPage({ searchParams }: PageProps<"/buscar">) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-display">Buscar obras</h1>
      {/* El formulario vacío forma parte del HTML estático: se puede usar antes de que lleguen los datos. */}
      <Suspense fallback={<SearchForm filters={{ page: 1 }} />}>
        <SearchFormSection searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<ArtworkGridSkeleton />}>
        <SearchResultsSection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
