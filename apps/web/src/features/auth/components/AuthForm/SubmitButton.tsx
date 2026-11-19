"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@galeria/ui";

type SubmitButtonProps = { children: ReactNode; variant?: ButtonProps["variant"] };

/** Botón de envío que se bloquea y anuncia la espera mientras la Server Action responde. */
export function SubmitButton({ children, variant = "primary" }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} loading={pending} className="w-full sm:w-auto">
      {children}
    </Button>
  );
}
