import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { siteConfig } from "@/shared/config";
import { NavLink } from "./NavLink";
import { navLinkStyles } from "./navLinkStyles";
import { NAV_ITEMS } from "./navigation";

type SiteHeaderProps = {
  /** Hueco para la sesión. Lo compone app/ (shared no conoce la feature auth). */
  account?: ReactNode;
};

export function SiteHeader({ account }: SiteHeaderProps) {
  return (
    <header className="border-b border-line bg-wall">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
        <Link
          href="/"
          className="font-display text-[2rem] leading-none font-black tracking-tight text-ink transition-colors hover:text-accent"
        >
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <nav aria-label="Principal">
            <ul className="flex items-center gap-4 sm:gap-7">
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
          {account}
        </div>
      </div>
    </header>
  );
}
