"use client";

import { useId, useState, type ChangeEvent } from "react";
import { Button, LiveRegion } from "@galeria/ui";
import type { Collection } from "../../lib/collection";
import { exportCollections, parseImport } from "../../lib/transfer";

type Props = {
  collections: Collection[];
  onImport: (collections: Collection[]) => Promise<unknown>;
};

function download(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: "galeria-colecciones.json",
  });
  link.click();
  URL.revokeObjectURL(url);
}

/** Copia de seguridad en JSON para no depender de un solo navegador. */
export function TransferPanel({ collections, onImport }: Props) {
  const inputId = useId();
  const [message, setMessage] = useState("");

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const parsed = parseImport(await file.text());
    if (!parsed.ok) return setMessage("Ese archivo no es una copia de colecciones de Galería.");
    await onImport(parsed.collections);
    setMessage(`Importadas ${parsed.collections.length} colecciones.`);
  }

  return (
    <section
      aria-labelledby={`${inputId}-title`}
      className="flex flex-col gap-3 border-t border-line pt-8"
    >
      <h2 id={`${inputId}-title`} className="text-label font-medium text-ink">
        Copia de seguridad
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={collections.length === 0}
          onClick={() => download(exportCollections(collections))}
        >
          Exportar (JSON)
        </Button>
        <label
          htmlFor={inputId}
          className="cursor-pointer text-[0.9375rem] underline decoration-ink/35 underline-offset-4 hover:text-accent"
        >
          Importar desde archivo
        </label>
        <input
          id={inputId}
          type="file"
          accept="application/json,.json"
          onChange={onFile}
          className="sr-only"
        />
      </div>
      <LiveRegion className="text-label text-ink-muted">{message}</LiveRegion>
    </section>
  );
}
