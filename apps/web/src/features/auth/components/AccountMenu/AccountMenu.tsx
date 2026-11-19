import Link from "next/link";
import { getSessionUser } from "../../server/session";
import { AccountLink } from "./AccountLink";

/**
 * Hueco de la cabecera para la sesión. Lee la cookie, así que vive dentro de un
 * <Suspense>: el resto de la cabecera sigue en el HTML estático (Cache Components).
 */
export async function AccountMenu() {
  const user = await getSessionUser();
  if (!user) return <AccountLink href="/entrar">Entrar</AccountLink>;
  return (
    <Link
      href="/cuenta"
      className="group inline-flex min-h-11 items-center gap-2.5 font-sans text-[1.0625rem] font-semibold text-ink"
    >
      <span
        aria-hidden="true"
        className="inline-flex size-8 items-center justify-center rounded-full bg-accent font-display text-base font-black text-accent-ink transition-transform duration-300 ease-out-expo group-hover:scale-110"
      >
        {user.name.charAt(0).toUpperCase()}
      </span>
      <span>
        <span className="sr-only">Tu cuenta: </span>
        {user.name}
      </span>
    </Link>
  );
}

/** Mientras se lee la sesión: mismo hueco, sin texto engañoso ni salto de diseño. */
export function AccountMenuFallback() {
  return <span aria-hidden="true" className="inline-block h-11 w-20" />;
}
