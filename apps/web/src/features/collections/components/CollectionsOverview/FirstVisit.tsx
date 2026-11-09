import Link from "next/link";
import { buttonStyles } from "@galeria/ui";

/** Primera visita: explica qué son las colecciones, dónde viven y cómo empezar. */
export function FirstVisit() {
  return (
    <section
      aria-labelledby="sin-colecciones"
      className="flex max-w-prose flex-col items-start gap-4 py-8"
    >
      <h2 id="sin-colecciones" className="font-display text-title">
        Aún no tienes colecciones
      </h2>
      <p className="text-ink-muted">
        Agrupa obras por tema o por sala: «Para mi salón», «Retratos», «Monet en invierno».
        Guárdalas desde la página de cualquier obra con{" "}
        <strong className="font-medium text-ink">Guardar en colección</strong>, o crea una vacía
        aquí.
      </p>
      <p className="text-ink-muted">
        Se guardan en este navegador, sin cuentas. Para verlas en otro dispositivo, compártelas con
        un enlace o exporta una copia.
      </p>
      <Link href="/buscar" className={buttonStyles("primary")}>
        Buscar obras para guardar
      </Link>
    </section>
  );
}
