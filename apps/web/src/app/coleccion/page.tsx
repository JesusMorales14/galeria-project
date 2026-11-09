import type { Metadata } from "next";
import { Suspense } from "react";
import { SharedCollectionSection } from "@/features/collections";
import { ArtworkGridSkeleton } from "@/shared/artwork";

export const metadata: Metadata = {
  title: "Colección compartida",
  description: "Una colección de obras del Art Institute of Chicago compartida desde Galería.",
};

export default function SharedCollectionPage({ searchParams }: PageProps<"/coleccion">) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="sr-only">Colección compartida</h1>
      <Suspense fallback={<ArtworkGridSkeleton />}>
        <SharedCollectionSection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
