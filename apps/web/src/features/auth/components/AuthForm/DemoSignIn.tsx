import { demoSignInAction } from "../../actions/authActions";
import { SubmitButton } from "./SubmitButton";

/** Atajo para quien revisa el proyecto: entra sin registrarse. */
export function DemoSignIn({ next }: { next: string }) {
  return (
    <form action={demoSignInAction} className="flex flex-col items-start gap-3">
      <input type="hidden" name="next" value={next} />
      <p className="font-sans text-label text-ink-muted">
        ¿Solo quieres echar un vistazo? Hay una cuenta de demostración lista.
      </p>
      <SubmitButton variant="secondary">Entrar con la cuenta de demostración</SubmitButton>
    </form>
  );
}
