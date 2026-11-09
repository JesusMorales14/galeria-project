import type { ReactNode } from "react";
import type { Artwork } from "@galeria/api-client";
import { TextLink } from "@galeria/ui";
import { artworkDetailRows } from "../../lib/detailRows";
import { ArtworkMedia } from "./ArtworkMedia";
import { DetailList } from "./DetailList";

type ArtworkDetailProps = {
  artwork: Artwork;
  /** Acciones de otras features (guardar en colección, ampliar) inyectadas desde la ruta. */
  actions?: ReactNode;
  /** Sustituye la imagen estática (p. ej. por el visor de zoom). */
  media?: ReactNode;
};

export function ArtworkDetail({ artwork, actions, media }: ArtworkDetailProps) {
  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      <div className="lg:sticky lg:top-8 lg:self-start">
        {media ?? <ArtworkMedia artwork={artwork} />}
      </div>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-title text-ink italic">{artwork.title}</h1>
          <p className="text-lg whitespace-pre-line text-ink-muted">
            {artwork.artistDisplay ?? artwork.artist ?? "Artista desconocido"}
          </p>
        </header>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        <DetailList rows={artworkDetailRows(artwork)} />
        {artwork.description && (
          <div className="flex max-w-prose flex-col gap-4 leading-7 whitespace-pre-line text-ink">
            {artwork.description}
          </div>
        )}
        <p className="text-label text-ink-muted">
          <TextLink
            href={`https://www.artic.edu/artworks/${artwork.id}`}
            external
            className="text-ink-muted"
          >
            Ficha completa en el Art Institute of Chicago
          </TextLink>
        </p>
      </div>
    </article>
  );
}
