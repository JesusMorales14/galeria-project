import { cloneElement, isValidElement, type HTMLAttributes, type ReactElement } from "react";
import { cn } from "../../lib/cn";

type SlotProps = HTMLAttributes<HTMLElement> & { children: ReactElement };

/**
 * Pasa props y clases al único hijo en lugar de renderizar su propio elemento.
 * Permite `<TextLink asChild><Link …/></TextLink>` sin que ui dependa de Next.js.
 */
export function Slot({ children, className, ...props }: SlotProps) {
  if (!isValidElement<HTMLAttributes<HTMLElement>>(children)) return null;
  return cloneElement(children, {
    ...props,
    ...children.props,
    className: cn(className, children.props.className),
  });
}
