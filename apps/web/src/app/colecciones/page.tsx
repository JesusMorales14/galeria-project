import type { Metadata } from "next";
import { CollectionsOverview } from "@/features/collections";

export const metadata: Metadata = {
  title: "Mis colecciones",
  description: "Tus colecciones de obras, guardadas en este navegador.",
  robots: { index: false },
};

export default function CollectionsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-display">Mis colecciones</h1>
      <CollectionsOverview />
    </main>
  );
}
