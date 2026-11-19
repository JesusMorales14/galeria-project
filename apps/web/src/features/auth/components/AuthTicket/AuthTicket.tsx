import type { ReactNode } from "react";
import "./ticket.css";

type AuthTicketProps = {
  titleId: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/** Contenedor de las páginas de acceso con forma de entrada de museo. */
export function AuthTicket({ titleId, title, intro, children, footer }: AuthTicketProps) {
  return (
    <section aria-labelledby={titleId} className="entrada w-full max-w-2xl">
      <div aria-hidden="true" className="entrada-talon">
        <span className="entrada-vertical font-display text-5xl leading-none font-black">
          Galería
        </span>
        <span className="entrada-vertical font-sans text-label font-semibold">
          Admisión general
        </span>
      </div>
      <div className="entrada-cuerpo flex flex-col gap-8 p-6 sm:p-10">
        <header className="flex flex-col gap-3">
          <h1 id={titleId} className="font-display text-display">
            {title}
          </h1>
          <div className="max-w-[48ch] text-lg leading-7 text-ink-muted">{intro}</div>
        </header>
        {children}
        {footer && <div className="border-t border-line pt-6">{footer}</div>}
      </div>
    </section>
  );
}
