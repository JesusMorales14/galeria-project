import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountMenu, AccountMenuFallback } from "@/features/auth";
import { siteConfig, siteUrl } from "@/shared/config";
import { SiteFooter, SiteHeader, SkipLink } from "@/shared/layout";
import { WebVitals } from "@/shared/observability";
import { bigShoulders, newsreader } from "@/shared/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: { siteName: siteConfig.name, locale: "es_ES", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.locale}
      className={`${bigShoulders.variable} ${newsreader.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-wall text-ink antialiased">
        <SkipLink />
        <SiteHeader
          account={
            <Suspense fallback={<AccountMenuFallback />}>
              <AccountMenu />
            </Suspense>
          }
        />
        <div id="contenido" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </div>
        <SiteFooter />
        <Suspense>
          <WebVitals />
        </Suspense>
      </body>
    </html>
  );
}
