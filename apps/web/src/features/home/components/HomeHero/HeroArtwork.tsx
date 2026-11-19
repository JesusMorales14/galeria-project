import Link from "next/link";
import type { ArtworkSummary } from "@galeria/api-client";
import { ArtworkImage } from "@galeria/ui";
import { artworkAltText, artworkHref, ArtworkTransition, toImageProps } from "@/shared/artwork";
import "./sala.css";

const HERO_SIZES = "(min-width: 1024px) 58vw, 100vw";

/** La obra colgada en la sala: lo primero que se ve, bajo el foco y con su cartela. */
export function HeroArtwork({ artwork }: { artwork: ArtworkSummary }) {
  const caption = [artwork.artist ?? "Artista desconocido", artwork.date]
    .filter(Boolean)
    .join(", ");
  return (
    <figure className="group relative flex flex-col gap-4">
      {artwork.image && (
        <ArtworkTransition id={artwork.id}>
          <div className="sala-obra">
            <ArtworkImage
              {...toImageProps(artwork.image, artworkAltText(artwork), HERO_SIZES)}
              priority
              className="bg-night-surface shadow-[0_2.5rem_4rem_-2rem_rgb(0_0_0/0.7)]"
            />
          </div>
        </ArtworkTransition>
      )}
      <figcaption className="flex flex-col gap-1">
        <Link
          href={artworkHref(artwork.id)}
          className="w-fit font-serif text-2xl text-night-ink italic decoration-light underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:underline"
        >
          {artwork.title}
        </Link>
        <span className="font-sans text-label text-night-ink-muted tabular-nums">{caption}</span>
      </figcaption>
    </figure>
  );
}
