import Link from "next/link";
import type { ArtworkSummary } from "@galeria/api-client";
import { ArtworkImage } from "@galeria/ui";
import { artworkAltText, artworkHref, toImageProps } from "@/shared/artwork";

const HERO_SIZES = "(min-width: 1024px) 58vw, 100vw";

/** La obra colgada en la sala: lo primero que se ve, a gran tamaño y con su cartela. */
export function HeroArtwork({ artwork }: { artwork: ArtworkSummary }) {
  const caption = [artwork.artist ?? "Artista desconocido", artwork.date]
    .filter(Boolean)
    .join(", ");
  return (
    <figure className="group relative flex flex-col gap-4">
      {artwork.image && (
        <ArtworkImage
          {...toImageProps(artwork.image, artworkAltText(artwork), HERO_SIZES)}
          priority
        />
      )}
      <figcaption className="flex flex-col gap-1">
        <Link
          href={artworkHref(artwork.id)}
          className="font-display text-2xl text-ink italic decoration-accent underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:underline"
        >
          {artwork.title}
        </Link>
        <span className="text-label text-ink-muted tabular-nums">{caption}</span>
      </figcaption>
    </figure>
  );
}
