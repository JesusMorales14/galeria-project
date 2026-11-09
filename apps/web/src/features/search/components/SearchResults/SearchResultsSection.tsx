import { searchArtworks } from "@/shared/api";
import { parseSearchFilters, toSearchQuery } from "../../lib/searchParams";
import { SearchResults } from "./SearchResults";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Lee la URL, consulta la API (con caché) y pinta los resultados. Se renderiza en el servidor. */
export async function SearchResultsSection({ searchParams }: Props) {
  const filters = parseSearchFilters(await searchParams);
  const result = await searchArtworks(toSearchQuery(filters));
  return <SearchResults result={result} filters={filters} />;
}
