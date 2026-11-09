import type { HTMLAttributes } from "react";

type LiveRegionProps = HTMLAttributes<HTMLDivElement> & {
  /** "polite" espera a que el lector termine; "assertive" interrumpe (solo para errores). */
  politeness?: "polite" | "assertive";
  visuallyHidden?: boolean;
};

/** Región que anuncia sus cambios a los lectores de pantalla. */
export function LiveRegion({
  politeness = "polite",
  visuallyHidden = false,
  className,
  ...props
}: LiveRegionProps) {
  return (
    <div
      role={politeness === "assertive" ? "alert" : "status"}
      aria-live={politeness}
      aria-atomic="true"
      className={visuallyHidden ? "sr-only" : className}
      {...props}
    />
  );
}
