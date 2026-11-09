import Link from "next/link";
import { buttonStyles } from "@galeria/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center gap-6 px-4 py-24 sm:px-8">
      <h1 className="font-display text-display">Esta sala está vacía</h1>
      <p className="max-w-prose text-lg text-ink-muted">
        La obra o la página que buscas no existe, o el museo ya no la muestra en su colección
        pública.
      </p>
      <Link href="/buscar" className={buttonStyles("primary")}>
        Buscar otra obra
      </Link>
    </main>
  );
}
