import type { Metadata } from "next";
import { AuthTicket, SignUpForm } from "@/features/auth";
import { safeRedirectPath } from "@/shared/auth";
import { AppLink } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta de Galería.",
  robots: { index: false },
};

/** Renderizado bloqueante (como /buscar): el formulario funciona también sin JavaScript. */
export const instant = false;

export default async function SignUpPage({ searchParams }: PageProps<"/registro">) {
  const next = safeRedirectPath((await searchParams).next);
  return (
    <main className="mx-auto flex w-full max-w-7xl justify-center px-4 py-12 sm:px-8 sm:py-20">
      <AuthTicket
        titleId="registro-titulo"
        title="Crear cuenta"
        intro={
          <p>
            ¿Ya tienes una?{" "}
            <AppLink href={`/entrar?next=${encodeURIComponent(next)}`}>Entra con ella</AppLink>.
          </p>
        }
      >
        <SignUpForm next={next} />
      </AuthTicket>
    </main>
  );
}
