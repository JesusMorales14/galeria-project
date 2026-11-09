"use client";

import { useState } from "react";
import { Button } from "@galeria/ui";
import type { Collection } from "../../lib/collection";
import { NewCollectionForm } from "../NewCollectionForm";
import { ShareControls } from "./ShareControls";

type Props = {
  collection: Collection;
  onRename: (name: string) => Promise<unknown>;
  onDelete: () => Promise<unknown>;
};

/** Título, renombrar, compartir y eliminar (con confirmación en dos pasos, sin diálogos del navegador). */
export function CollectionHeader({ collection, onRename, onDelete }: Props) {
  const [renaming, setRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const total = collection.artworkIds.length;

  return (
    <header className="flex flex-col gap-5">
      <h1 className="font-display text-display">{collection.name}</h1>
      <p className="text-ink-muted tabular-nums">{total === 1 ? "1 obra" : `${total} obras`}</p>
      <div className="flex flex-wrap gap-2">
        <ShareControls collection={collection} />
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={renaming}
          onClick={() => setRenaming((v) => !v)}
        >
          Renombrar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={confirmDelete ? "text-danger" : undefined}
          onClick={() => (confirmDelete ? void onDelete() : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
        >
          {confirmDelete ? "Pulsa otra vez para eliminar" : "Eliminar colección"}
        </Button>
      </div>
      {renaming && (
        <NewCollectionForm
          label="Nuevo nombre"
          submitLabel="Guardar"
          className="max-w-md"
          onCreate={async (name) => {
            await onRename(name);
            setRenaming(false);
          }}
        />
      )}
    </header>
  );
}
