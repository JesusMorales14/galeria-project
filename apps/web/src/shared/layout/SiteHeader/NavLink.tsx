"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, type NavItem } from "./navigation";
import { navLinkStyles } from "./navLinkStyles";

/** Enlace de navegación que se marca como página actual (aria-current). */
export function NavLink({ href, label }: NavItem) {
  const active = isActivePath(usePathname(), href);
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={navLinkStyles(active)}>
      {label}
    </Link>
  );
}
