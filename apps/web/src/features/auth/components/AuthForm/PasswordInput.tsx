"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { TextInput } from "@galeria/ui";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { id: string };

/**
 * Campo de contraseña con botón para mostrarla. El botón es un toggle (aria-pressed)
 * con nombre fijo, como recomienda WCAG: su estado lo anuncia el lector de pantalla.
 */
export function PasswordInput({ id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;
  return (
    <div className="relative">
      <TextInput id={id} type={visible ? "text" : "password"} className="pr-12" {...props} />
      <button
        type="button"
        aria-pressed={visible}
        aria-controls={id}
        onClick={() => setVisible((value) => !value)}
        className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-ink-muted transition-colors hover:text-ink"
      >
        <Icon aria-hidden="true" className="size-5" />
        <span className="sr-only">Mostrar contraseña</span>
      </button>
    </div>
  );
}
