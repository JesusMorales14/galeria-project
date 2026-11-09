import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ArtworkCardProps = {
  href: string;
  title: string;
  artist: string | null;
  date: string | null;
  /** La imagen ya resuelta (ArtworkImage u otra). La tarjeta no sabe de dónde viene. */
  media: ReactNode;
  /** Componente de enlace del router (p. ej. next/link). Por defecto, <a>. */
  linkComponent?: ElementType<{ href: string; className?: string; children?: ReactNode }>;
  headingLevel?: 2 | 3;
  className?: string;
};

/**
 * Obra en una cuadrícula, presentada como en una sala: imagen y cartela debajo.
 * Toda la tarjeta es clicable, pero el enlace se nombra solo con el título
 * (patrón de "enlace estirado"), para no repetir el texto alternativo.
 */
export function ArtworkCard({
  href,
  title,
  artist,
  date,
  media,
  linkComponent: Link = "a",
  headingLevel = 3,
  className,
}: ArtworkCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 has-[a:focus-visible]:outline-2",
        "has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent",
        className,
      )}
    >
      <div className="overflow-hidden bg-placeholder">{media}</div>
      <div className="flex flex-col gap-1">
        <Heading className="font-display text-lg leading-snug text-ink italic">
          <Link
            href={href}
            className="decoration-accent underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0"
          >
            {title}
          </Link>
        </Heading>
        <p className="text-label text-ink-muted">{artist ?? "Artista desconocido"}</p>
        {date && <p className="text-label text-ink-muted tabular-nums">{date}</p>}
      </div>
    </article>
  );
}
