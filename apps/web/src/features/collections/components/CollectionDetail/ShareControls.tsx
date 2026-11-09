"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { Button, LiveRegion } from "@galeria/ui";
import type { Collection } from "../../lib/collection";
import { buildShareHref } from "../../lib/shareLink";

/** Copia el enlace de la colección: quien lo abra la ve sin cuenta ni servidor. */
export function ShareControls({ collection }: { collection: Collection }) {
  const [copied, setCopied] = useState(false);
  const disabled = collection.artworkIds.length === 0;

  async function copy() {
    const url = new URL(buildShareHref(collection), window.location.origin).href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={copy} disabled={disabled}>
        {copied ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Link2 aria-hidden="true" className="size-4" />
        )}
        {copied ? "Enlace copiado" : "Copiar enlace para compartir"}
      </Button>
      <LiveRegion visuallyHidden>{copied ? "Enlace copiado al portapapeles" : ""}</LiveRegion>
    </>
  );
}
