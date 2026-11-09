import { parseSearchFilters } from "../../lib/searchParams";
import { SearchForm } from "./SearchForm";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** El formulario muestra los filtros que ya están en la URL. */
export async function SearchFormSection({ searchParams }: Props) {
  return <SearchForm filters={parseSearchFilters(await searchParams)} />;
}
