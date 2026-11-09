import type { SearchResult } from "@galeria/api-client";
import { EmptyState, LiveRegion } from "@galeria/ui";
import { ArtworkGrid } from "@/shared/artwork";
import { AppLink } from "@/shared/ui";
import { resultsSummary } from "../../lib/resultsSummary";
import { hasActiveFilters, type SearchFilters } from "../../lib/searchParams";
import { Pagination } from "../Pagination";

type SearchResultsProps = { result: SearchResult; filters: SearchFilters };

/** Resultados de búsqueda: resumen anunciado, cuadrícula o estado vacío, y paginación. */
export function SearchResults({ result, filters }: SearchResultsProps) {
  const summary = resultsSummary(result.total, filters.page, result.totalPages);

  return (
    <section aria-labelledby="resultados" className="flex flex-col gap-8">
      <h2 id="resultados" className="sr-only">
        Resultados
      </h2>
      <LiveRegion className="text-label text-ink-muted tabular-nums">{summary}</LiveRegion>
      {result.items.length === 0 ? (
        <EmptyState
          headingLevel={3}
          title="No encontramos obras con esos filtros"
          description="Prueba quitando alguno, con otra palabra o con el nombre del artista en inglés."
          action={
            hasActiveFilters(filters) ? (
              <AppLink href="/buscar">Limpiar filtros</AppLink>
            ) : undefined
          }
        />
      ) : (
        <ArtworkGrid artworks={result.items} priorityCount={2} />
      )}
      <Pagination filters={filters} totalPages={result.totalPages} />
    </section>
  );
}
