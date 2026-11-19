import Link from "next/link";
import type { ReactNode } from "react";

export function AccountLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center border border-edge px-4 font-sans text-[1.0625rem] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </Link>
  );
}
