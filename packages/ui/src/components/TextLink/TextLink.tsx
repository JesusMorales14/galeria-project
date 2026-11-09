import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactElement } from "react";
import { cn } from "../../lib/cn";
import { Slot } from "../Slot";
import { VisuallyHidden } from "../VisuallyHidden";

const linkStyles =
  "text-ink underline decoration-ink/35 decoration-1 underline-offset-[0.22em] " +
  "transition-colors duration-200 hover:text-accent hover:decoration-accent";

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: false;
  /** Abre en otra pestaña de forma segura y lo indica al lector de pantalla. */
  external?: boolean;
};
type AsChildProps = { asChild: true; className?: string; children: ReactElement };

export type TextLinkProps = AnchorProps | AsChildProps;

export function TextLink(props: TextLinkProps) {
  if (props.asChild) {
    return <Slot className={cn(linkStyles, props.className)}>{props.children}</Slot>;
  }
  const { external = false, className, children, asChild: _asChild, ...rest } = props;
  return (
    <a
      className={cn(linkStyles, "inline-flex items-baseline gap-0.5", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {external && (
        <>
          <ArrowUpRight aria-hidden="true" className="size-[0.85em] self-center" />
          <VisuallyHidden>(se abre en una nueva pestaña)</VisuallyHidden>
        </>
      )}
    </a>
  );
}
