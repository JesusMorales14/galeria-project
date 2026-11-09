import Link from "next/link";
import type { Collection } from "../../lib/collection";

const dateFormat = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });
const count = (n: number) => (n === 1 ? "1 obra" : `${n} obras`);

export function CollectionList({ collections }: { collections: Collection[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {collections.map((collection) => (
        <li
          key={collection.id}
          className="group relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
        >
          <Link
            href={`/colecciones/${collection.id}`}
            className="font-display text-2xl text-ink group-hover:text-accent after:absolute after:inset-0"
          >
            {collection.name}
          </Link>
          <p className="text-label text-ink-muted tabular-nums">
            {count(collection.artworkIds.length)} · actualizada el{" "}
            {dateFormat.format(new Date(collection.updatedAt))}
          </p>
        </li>
      ))}
    </ul>
  );
}
