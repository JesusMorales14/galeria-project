"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonStyles } from "@galeria/ui";
import { useCollections } from "../../hooks/useCollections";
import type { SharedCollection } from "../../lib/shareLink";

/** Copia la colección compartida a las colecciones propias de este navegador. */
export function SaveSharedCollection({ collection }: { collection: SharedCollection }) {
  const { create } = useCollections();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (savedId) {
    return (
      <Link href={`/colecciones/${savedId}`} className={buttonStyles("secondary")}>
        Guardada · ver en mis colecciones
      </Link>
    );
  }
  return (
    <Button
      loading={pending}
      onClick={async () => {
        setPending(true);
        const created = await create(collection.name, collection.artworkIds);
        setSavedId(created.id);
      }}
    >
      Guardar en mis colecciones
    </Button>
  );
}
