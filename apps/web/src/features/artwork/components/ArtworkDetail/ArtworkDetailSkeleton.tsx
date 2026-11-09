import { Skeleton } from "@galeria/ui";

export function ArtworkDetailSkeleton() {
  return (
    <div
      className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16"
      aria-busy="true"
    >
      <Skeleton className="aspect-[4/3]" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="mt-6 h-40" />
      </div>
      <p role="status" className="sr-only">
        Cargando la obra…
      </p>
    </div>
  );
}
