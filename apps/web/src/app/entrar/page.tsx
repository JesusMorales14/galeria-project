import type { Metadata } from "next";
import { AuthTicket, DemoSignIn, SignInForm } from "@/features/auth";
import { safeRedirectPath } from "@/shared/auth";
import { AppLink } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entra en tu cuenta de Galería.",
  robots: { index: false },
};

/** Renderizado bloqueante (como /buscar): el formulario funciona también sin JavaScript. */
export const instant = false;

export default async function SignInPage({ searchParams }: PageProps<"/entrar">) {
  const next = safeRedirectPath((await searchParams).next);
  const registerHref = `/registro?next=${encodeURIComponent(next)}`;
  return (
    <main className="mx-auto flex w-full max-w-7xl justify-center px-4 py-12 sm:px-8 sm:py-20">
      <AuthTicket
        titleId="entrar-titulo"
        title="Entrar"
        intro={
          <p>
            ¿Aún no tienes cuenta? <AppLink href={registerHref}>Crea una en un minuto</AppLink>.
          </p>
        }
        footer={<DemoSignIn next={next} />}
      >
        <SignInForm next={next} />
      </AuthTicket>
    </main>
  );
}
