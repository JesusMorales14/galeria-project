"use client";

import { Bookmark } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Button, LiveRegion } from "@galeria/ui";
import { useCollections } from "../../hooks/useCollections";
import type { Collection } from "../../lib/collection";
import { saveLabel } from "./saveLabel";
import { SavePanel } from "./SavePanel";

type SaveToCollectionProps = { artworkId: number; artworkTitle: string };

/** Guarda la obra en una o varias colecciones. Panel desplegable que se cierra con Escape. */
export function SaveToCollection({ artworkId, artworkTitle }: SaveToCollectionProps) {
  const { collections, create, addArtwork, removeArtwork } = useCollections();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const savedIn = collections?.filter((c) => c.artworkIds.includes(artworkId)).length ?? 0;

  async function toggle(collection: Collection, checked: boolean) {
    await (checked
      ? addArtwork(collection.id, artworkId)
      : removeArtwork(collection.id, artworkId));
    setMessage(`${artworkTitle} ${checked ? "guardada en" : "quitada de"} ${collection.name}`);
  }

  async function createWithArtwork(name: string) {
    await create(name, [artworkId]);
    setMessage(`${artworkTitle} guardada en la nueva colección ${name}`);
  }

  function closeOnEscape(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape") return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    // El contenedor solo escucha Escape para cerrar el panel; los controles están dentro.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="flex w-full flex-col gap-3" onKeyDown={closeOnEscape}>
      <Button
        ref={triggerRef}
        variant="secondary"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="self-start"
      >
        <Bookmark
          aria-hidden="true"
          className="size-4"
          fill={savedIn > 0 ? "currentColor" : "none"}
        />
        {saveLabel(savedIn)}
      </Button>
      {open && (
        <SavePanel
          id={panelId}
          collections={collections}
          artworkId={artworkId}
          onToggle={toggle}
          onCreate={createWithArtwork}
        />
      )}
      <LiveRegion visuallyHidden>{message}</LiveRegion>
    </div>
  );
}
