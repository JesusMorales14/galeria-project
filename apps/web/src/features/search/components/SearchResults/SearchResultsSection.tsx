import { searchArtworks } from "@/shared/api";
import { setSearchScope } from "@/shared/observability/server";
import { parseSearchFilters, toSearchQuery } from "../../lib/searchParams";
import { SearchResults } from "./SearchResults";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Lee la URL, consulta la API (con caché) y pinta los resultados. Se renderiza en el servidor. */
export async function SearchResultsSection({ searchParams }: Props) {
  const filters = parseSearchFilters(await searchParams);
  const query = toSearchQuery(filters);
  setSearchScope(query);
  const result = await searchArtworks(query);
  return <SearchResults result={result} filters={filters} />;
}
