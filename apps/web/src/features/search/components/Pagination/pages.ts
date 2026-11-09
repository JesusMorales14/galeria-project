export type PageItem = { type: "page"; page: number } | { type: "gap"; key: string };

/** Páginas a mostrar: primera, última y las vecinas de la actual, con huecos. */
export function visiblePages(current: number, total: number): PageItem[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, index): PageItem[] => {
    const previous = sorted[index - 1];
    const gap: PageItem[] =
      previous !== undefined && page - previous > 1 ? [{ type: "gap", key: `gap-${page}` }] : [];
    return [...gap, { type: "page", page }];
  });
}
