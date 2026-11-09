"use client";

import { Skeleton } from "@galeria/ui";
import { useCollections } from "../../hooks/useCollections";
import { NewCollectionForm } from "../NewCollectionForm";
import { CollectionList } from "./CollectionList";
import { FirstVisit } from "./FirstVisit";
import { TransferPanel } from "./TransferPanel";

/** Página de colecciones: los datos viven en el navegador (IndexedDB). */
export function CollectionsOverview() {
  const { collections, persistent, create, importMany } = useCollections();

  return (
    <div className="flex flex-col gap-10">
      {!persistent && (
        <p role="note" className="border border-line bg-surface p-4 text-[0.9375rem]">
          Este navegador no permite guardar datos (¿modo privado?). Tus colecciones se perderán al
          cerrar la pestaña: compártelas o expórtalas antes.
        </p>
      )}
      {collections === null ? (
        <div aria-busy="true" className="flex flex-col gap-4">
          <p role="status" className="sr-only">
            Cargando tus colecciones…
          </p>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : collections.length === 0 ? (
        <FirstVisit />
      ) : (
        <CollectionList collections={collections} />
      )}
      <NewCollectionForm onCreate={(name) => create(name)} className="max-w-md" />
      {collections && <TransferPanel collections={collections} onImport={importMany} />}
    </div>
  );
}
