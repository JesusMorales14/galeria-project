import type { DetailRow } from "../../lib/detailRows";

/** Ficha técnica como lista de definiciones: término y valor. */
export function DetailList({ rows }: { rows: DetailRow[] }) {
  if (rows.length === 0) return null;
  return (
    <dl className="grid grid-cols-[minmax(6rem,auto)_1fr] gap-x-6 gap-y-3 border-t border-line pt-6 text-[0.9375rem]">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-ink-muted">{row.label}</dt>
          <dd className="text-ink tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
