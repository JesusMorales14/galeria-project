import type { ArtworkSummary } from "@galeria/api-client";
import { ArtworkTile } from "./ArtworkTile";
import "./salon.css";

type SalonWallProps = { artworks: ArtworkSummary[]; headingLevel?: 2 | 3 };

/**
 * Obras colgadas como en un salón del siglo XIX: en columnas apretadas, cada una con su
 * proporción real. El orden de lectura sigue las columnas, como al recorrer la pared.
 * Para resultados ordenados (búsqueda) se usa ArtworkGrid, que respeta el orden por filas.
 */
export function SalonWall({ artworks, headingLevel }: SalonWallProps) {
  return (
    <ul className="columns-1 gap-x-10 sm:columns-2 lg:columns-3 lg:gap-x-14">
      {artworks.map((artwork) => (
        <li key={artwork.id} className="salon-cuadro mb-12 lg:mb-16">
          <ArtworkTile artwork={artwork} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
