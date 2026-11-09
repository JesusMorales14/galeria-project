"use client";

import { ArrowDown, ArrowUp, X } from "lucide-react";
import { Button } from "@galeria/ui";

type Props = {
  title: string;
  index: number;
  total: number;
  artworkId: number;
  onMove: (toIndex: number) => void;
  onRemove: () => void;
};

/** Alternativa accesible al arrastre: mover con botones (teclado y lector de pantalla). */
export function ReorderControls({ title, index, total, artworkId, onMove, onRemove }: Props) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        data-move={`${artworkId}-up`}
        aria-label={`Mover «${title}» antes`}
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
      >
        <ArrowUp aria-hidden="true" className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        data-move={`${artworkId}-down`}
        aria-label={`Mover «${title}» después`}
        disabled={index === total - 1}
        onClick={() => onMove(index + 1)}
      >
        <ArrowDown aria-hidden="true" className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Quitar «${title}» de la colección`}
        onClick={onRemove}
      >
        <X aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}
