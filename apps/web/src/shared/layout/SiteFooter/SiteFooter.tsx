import { TextLink } from "@galeria/ui";
import { siteConfig } from "@/shared/config";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-8 text-label text-ink-muted sm:flex-row sm:justify-between sm:px-8">
        <p>
          Obras e imágenes de la colección pública del{" "}
          <TextLink href="https://www.artic.edu" external className="text-ink-muted">
            Art Institute of Chicago
          </TextLink>
          , en dominio público.
        </p>
        <p>
          <TextLink href={siteConfig.repositoryUrl} external className="text-ink-muted">
            Código del proyecto
          </TextLink>
        </p>
      </div>
    </footer>
  );
}
