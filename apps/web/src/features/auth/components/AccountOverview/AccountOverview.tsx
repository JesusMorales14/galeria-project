import { AppLink } from "@/shared/ui";
import { signOutAction, signOutEverywhereAction } from "../../actions/authActions";
import { SubmitButton } from "../AuthForm/SubmitButton";
import { authService } from "../../server/container";
import { requireUser } from "../../server/session";
import { formatMemberSince, sessionsLabel } from "./accountText";

/** Contenido de /cuenta. Verifica la sesión en el servidor (no se fía solo de proxy.ts). */
export async function AccountOverview() {
  const user = await requireUser("/cuenta");
  const sessions = await (await authService()).activeSessions(user.id);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
      <section aria-labelledby="perfil" className="flex flex-col gap-6">
        <h2 id="perfil" className="font-display text-title">
          {user.name}
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 font-sans text-lg">
          <dt className="text-ink-muted">Correo</dt>
          <dd className="break-all">{user.email}</dd>
          <dt className="text-ink-muted">En Galería desde</dt>
          <dd>{formatMemberSince(user.createdAt)}</dd>
          <dt className="text-ink-muted">Sesiones abiertas</dt>
          <dd className="tabular-nums">{sessionsLabel(sessions)}</dd>
        </dl>
        <p className="max-w-[52ch] leading-7 text-ink-muted">
          Tus colecciones se guardan en este navegador y se comparten con un enlace.{" "}
          <AppLink href="/colecciones">Ir a mis colecciones</AppLink>
        </p>
      </section>

      <section
        aria-labelledby="seguridad"
        className="flex flex-col gap-5 border-t border-line pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10"
      >
        <h2 id="seguridad" className="font-display text-3xl font-bold">
          Seguridad
        </h2>
        <p className="leading-7 text-ink-muted">
          La sesión se renueva sola mientras la uses y caduca tras 7 días sin actividad.
        </p>
        <form action={signOutAction}>
          <SubmitButton>Cerrar sesión</SubmitButton>
        </form>
        <form action={signOutEverywhereAction} className="flex flex-col items-start gap-2">
          <SubmitButton variant="secondary">Cerrar sesión en todos los dispositivos</SubmitButton>
          <p className="font-sans text-label text-ink-muted">
            Útil si entraste desde un ordenador que no es tuyo.
          </p>
        </form>
      </section>
    </div>
  );
}
