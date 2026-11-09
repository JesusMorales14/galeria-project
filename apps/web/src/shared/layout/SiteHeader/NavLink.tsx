"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@galeria/ui";
import { isActivePath, type NavItem } from "./navigation";

/** Enlace de navegación que se marca como página actual (aria-current). */
export function NavLink({ href, label }: NavItem) {
  const active = isActivePath(usePathname(), href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "py-2 text-[0.9375rem] text-ink-muted transition-colors hover:text-ink",
        "decoration-accent decoration-2 underline-offset-8",
        active && "text-ink underline",
      )}
    >
      {label}
    </Link>
  );
}
