"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeRedirectPath } from "@/shared/auth";
import { AuthError, type Session } from "../lib/authService";
import { formFields, signInSchema, signUpSchema, toFieldErrors } from "../lib/credentials";
import { DEMO_ACCOUNT } from "../lib/demoAccount";
import { authService, signInLimiter } from "../server/container";
import {
  clearSessionCookies,
  getSessionUser,
  readRefreshToken,
  writeSessionCookies,
} from "../server/session";
import { AUTH_ERROR_MESSAGES, tooManyAttempts, type AuthFormState } from "./formState";

/*
 * Server Actions de autenticación. Next.js comprueba que el Origin de la petición coincide
 * con el host (protección CSRF) y los formularios funcionan también sin JavaScript.
 */

type Outcome = { session: Session } | { failure: AuthFormState };

async function run(operation: () => Promise<Session>): Promise<Outcome> {
  try {
    return { session: await operation() };
  } catch (error) {
    const known = error instanceof AuthError ? AUTH_ERROR_MESSAGES[error.code] : undefined;
    if (!known) throw error; // fallo inesperado: lo recoge el error boundary y Sentry
    return { failure: known };
  }
}

async function clientKey(email: string): Promise<string> {
  const list = await headers();
  const ip = list.get("x-forwarded-for")?.split(",")[0]?.trim() ?? list.get("x-real-ip") ?? "local";
  return `${ip}:${email}`;
}

export async function signInAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fields = formFields(formData, ["email", "password", "next"]);
  const values = { email: fields.email };
  const parsed = signInSchema.safeParse(fields);
  if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error), values };

  const key = await clientKey(parsed.data.email);
  const limit = await (await signInLimiter()).consume(key);
  if (!limit.allowed) return { message: tooManyAttempts(limit.retryAfterMs), values };

  const outcome = await run(async () => (await authService()).signIn(parsed.data));
  if ("failure" in outcome) return { ...outcome.failure, values };

  await (await signInLimiter()).reset(key);
  await writeSessionCookies(outcome.session.tokens);
  redirect(safeRedirectPath(fields.next));
}

export async function signUpAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fields = formFields(formData, ["name", "email", "password", "next"]);
  const values = { name: fields.name, email: fields.email };
  const parsed = signUpSchema.safeParse(fields);
  if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error), values };

  const outcome = await run(async () => (await authService()).signUp(parsed.data));
  if ("failure" in outcome) return { ...outcome.failure, values };

  await writeSessionCookies(outcome.session.tokens);
  redirect(safeRedirectPath(fields.next));
}

/** Entra con la cuenta de demostración: quien revisa el proyecto no tiene que registrarse. */
export async function demoSignInAction(formData: FormData): Promise<void> {
  const { email, password } = DEMO_ACCOUNT;
  const session = await (await authService()).signIn({ email, password });
  await writeSessionCookies(session.tokens);
  redirect(safeRedirectPath(formFields(formData, ["next"]).next));
}

export async function signOutAction(): Promise<void> {
  await (await authService()).signOut(await readRefreshToken());
  await clearSessionCookies();
  redirect("/");
}

/** Cierra la sesión en todos los dispositivos: revoca todos los tokens de refresco. */
export async function signOutEverywhereAction(): Promise<void> {
  const user = await getSessionUser();
  if (user) await (await authService()).signOutEverywhere(user.id);
  await clearSessionCookies();
  redirect("/entrar");
}
