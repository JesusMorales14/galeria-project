import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@galeria/ui";
import { AccountOverview } from "@/features/auth";

export const metadata: Metadata = {
  title: "Tu cuenta",
  robots: { index: false },
};

/** El título va en el HTML estático; los datos de la cuenta llegan tras leer la sesión. */
export default function AccountPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-display">Tu cuenta</h1>
      <Suspense fallback={<Skeleton className="h-64 w-full max-w-xl" />}>
        <AccountOverview />
      </Suspense>
    </main>
  );
}
