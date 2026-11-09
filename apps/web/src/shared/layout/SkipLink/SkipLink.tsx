/** Primer elemento enfocable: permite saltar la navegación con el teclado. */
export function SkipLink({ targetId = "contenido" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-wall"
    >
      Saltar al contenido
    </a>
  );
}
