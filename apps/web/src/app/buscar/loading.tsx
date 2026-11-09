import { ArtworkGridSkeleton } from "@/shared/artwork";

export default function SearchLoading() {
  return (
    <main
      className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-8 sm:py-16"
      aria-busy="true"
    >
      <h1 className="font-display text-display">Buscar obras</h1>
      <p className="sr-only" role="status">
        Cargando resultados…
      </p>
      <ArtworkGridSkeleton />
    </main>
  );
}
