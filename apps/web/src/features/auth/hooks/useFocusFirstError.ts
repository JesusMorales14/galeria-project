"use client";

import { useEffect, type RefObject } from "react";

/**
 * Tras un envío con errores, lleva el foco al primer campo inválido (WCAG 3.3.1):
 * quien usa teclado o lector de pantalla llega directo a lo que tiene que corregir.
 * Si solo hay un error general, el role="alert" ya lo anuncia.
 */
export function useFocusFirstError(formRef: RefObject<HTMLFormElement | null>, state: unknown) {
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [formRef, state]);
}
