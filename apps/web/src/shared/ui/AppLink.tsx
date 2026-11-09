import Link from "next/link";
import type { ComponentProps } from "react";
import { TextLink } from "@galeria/ui";

/** Enlace de texto del design system con navegación del router de Next.js. */
export function AppLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <TextLink asChild className={className}>
      <Link {...props} />
    </TextLink>
  );
}
