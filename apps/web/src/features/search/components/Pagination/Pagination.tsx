import Link from "next/link";
import { cn } from "@galeria/ui";
import { buildSearchHref, type SearchFilters } from "../../lib/searchParams";
import { visiblePages } from "./pages";

type PaginationProps = { filters: SearchFilters; totalPages: number };

const itemStyles = "inline-flex h-10 min-w-10 items-center justify-center px-3 text-[0.9375rem]";

export function Pagination({ filters, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;
  const { page } = filters;
  const href = (target: number) => buildSearchHref(filters, { page: target });

  return (
    <nav aria-label="Paginación" className="mt-16 flex flex-wrap items-center justify-center gap-1">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" className={cn(itemStyles, "hover:text-accent")}>
          Anterior
        </Link>
      )}
      <ul className="flex flex-wrap items-center gap-1">
        {visiblePages(page, totalPages).map((item) =>
          item.type === "gap" ? (
            <li key={item.key} aria-hidden="true" className={cn(itemStyles, "text-ink-muted")}>
              …
            </li>
          ) : (
            <li key={item.page}>
              <Link
                href={href(item.page)}
                aria-current={item.page === page ? "page" : undefined}
                aria-label={`Página ${item.page}`}
                className={cn(
                  itemStyles,
                  "tabular-nums hover:text-accent",
                  item.page === page && "bg-ink text-wall hover:text-wall",
                )}
              >
                {item.page}
              </Link>
            </li>
          ),
        )}
      </ul>
      {page < totalPages && (
        <Link href={href(page + 1)} rel="next" className={cn(itemStyles, "hover:text-accent")}>
          Siguiente
        </Link>
      )}
    </nav>
  );
}
