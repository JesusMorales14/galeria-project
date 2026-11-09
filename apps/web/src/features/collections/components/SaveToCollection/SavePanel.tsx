"use client";

import type { Collection } from "../../lib/collection";
import { NewCollectionForm } from "../NewCollectionForm";
import { CollectionCheckboxes } from "./CollectionCheckboxes";

type SavePanelProps = {
  id: string;
  collections: Collection[] | null;
  artworkId: number;
  onToggle: (collection: Collection, checked: boolean) => void;
  onCreate: (name: string) => Promise<unknown>;
};

export function SavePanel({ id, collections, artworkId, onToggle, onCreate }: SavePanelProps) {
  const hasCollections = Boolean(collections?.length);
  return (
    <div id={id} className="flex max-w-md flex-col gap-5 border border-line bg-surface p-5">
      {collections === null && (
        <p className="text-label text-ink-muted">Cargando tus colecciones…</p>
      )}
      {collections && hasCollections && (
        <CollectionCheckboxes collections={collections} artworkId={artworkId} onToggle={onToggle} />
      )}
      <NewCollectionForm
        label={hasCollections ? "O crea una nueva" : "Crea tu primera colección"}
        submitLabel="Crear y guardar"
        onCreate={onCreate}
      />
    </div>
  );
}
