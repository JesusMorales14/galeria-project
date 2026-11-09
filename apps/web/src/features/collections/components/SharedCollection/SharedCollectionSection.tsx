import { EmptyState } from "@galeria/ui";
import { getArtworksByIds } from "@/shared/api";
import { ArtworkGrid } from "@/shared/artwork";
import { AppLink } from "@/shared/ui";
import { parseSharedCollection } from "../../lib/shareLink";
import { SaveSharedCollection } from "./SaveSharedCollection";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const MESSAGES = {
  empty: {
    title: "Este enlace no contiene obras",
    description: "Pide a quien te lo envió que lo copie de nuevo desde su colección.",
  },
  invalid: {
    title: "Este enlace de colección no es válido",
    description:
      "Puede que se copiara incompleto o que se haya modificado. Pide a quien te lo envió que lo copie de nuevo.",
  },
};

/** Colección recibida por enlace: se valida la URL y se pintan las obras en el servidor. */
export async function SharedCollectionSection({ searchParams }: Props) {
  const parsed = parseSharedCollection(await searchParams);
  if (!parsed.ok) {
    return (
      <EmptyState
        headingLevel={2}
        {...MESSAGES[parsed.reason]}
        action={<AppLink href="/buscar">Buscar obras</AppLink>}
      />
    );
  }

  const { collection } = parsed;
  const artworks = await getArtworksByIds(collection.artworkIds);
  const missing = collection.artworkIds.length - artworks.length;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col items-start gap-4">
        <h2 className="font-display text-display">{collection.name}</h2>
        <p className="text-ink-muted tabular-nums">
          Colección compartida · {artworks.length === 1 ? "1 obra" : `${artworks.length} obras`}
          {missing > 0 && ` (${missing} ya no están en la colección pública del museo)`}
        </p>
        <SaveSharedCollection collection={collection} />
      </header>
      <ArtworkGrid artworks={artworks} priorityCount={2} />
    </div>
  );
}
