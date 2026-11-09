import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionDetail } from "@/features/collections";

export const metadata: Metadata = { title: "Colección", robots: { index: false } };

async function CollectionFromParams({ params }: { params: Promise<{ id: string }> }) {
  return <CollectionDetail id={(await params).id} />;
}

export default function CollectionPage({ params }: PageProps<"/colecciones/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-12 sm:px-8 sm:py-16">
      <Suspense>
        <CollectionFromParams params={params} />
      </Suspense>
    </main>
  );
}
