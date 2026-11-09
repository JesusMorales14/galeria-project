import { ArtworkCardSkeleton } from "@galeria/ui";

const RATIOS = [1.3, 0.8, 1, 0.75, 1.2, 0.9, 1.4, 0.8];

export function ArtworkGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ArtworkCardSkeleton key={index} aspectRatio={RATIOS[index % RATIOS.length]} />
      ))}
    </div>
  );
}
