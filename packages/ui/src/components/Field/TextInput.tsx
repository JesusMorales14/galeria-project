import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { controlStyles } from "./fieldStyles";

export function TextInput({
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input type={type} className={cn(controlStyles, className)} {...props} />;
}
