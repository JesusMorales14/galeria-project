import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/shared/config";
import { NavLink } from "./NavLink";
import { navLinkStyles } from "./navLinkStyles";
import { NAV_ITEMS } from "./navigation";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-7xl items-baseline justify-between gap-6 px-4 py-5 sm:px-8">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          {siteConfig.name}
        </Link>
        <nav aria-label="Principal">
          <ul className="flex items-baseline gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {/* El enlace activo depende de la URL: el HTML estático lleva la versión sin marcar. */}
                <Suspense
                  fallback={
                    <Link href={item.href} className={navLinkStyles(false)}>
                      {item.label}
                    </Link>
                  }
                >
                  <NavLink {...item} />
                </Suspense>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
