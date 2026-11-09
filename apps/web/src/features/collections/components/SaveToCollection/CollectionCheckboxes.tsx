"use client";

import type { Collection } from "../../lib/collection";

type Props = {
  collections: Collection[];
  artworkId: number;
  onToggle: (collection: Collection, checked: boolean) => void;
};

/** Una casilla por colección: marcada si la obra ya está guardada en ella. */
export function CollectionCheckboxes({ collections, artworkId, onToggle }: Props) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-label font-medium text-ink">Tus colecciones</legend>
      {collections.map((collection) => {
        const checked = collection.artworkIds.includes(artworkId);
        return (
          <label key={collection.id} className="flex items-center gap-3 py-1 text-[0.9375rem]">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => onToggle(collection, event.target.checked)}
              className="size-4"
            />
            <span>{collection.name}</span>
            <span className="text-label text-ink-muted tabular-nums">
              {collection.artworkIds.length}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
