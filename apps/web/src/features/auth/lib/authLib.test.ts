// @vitest-environment node
import { describe, expect, it } from "vitest";
import { formFields, signInSchema, signUpSchema, toFieldErrors } from "./credentials";
import { hashPassword, verifyPassword } from "./password";
import { createMemoryAttemptStore, createRateLimiter } from "./rateLimiter";
import { readStorageConfig } from "./storageConfig";

describe("contraseñas (scrypt)", () => {
  it("verifica la contraseña correcta y rechaza las demás", async () => {
    const hash = await hashPassword("una-clave-larga");

    expect(hash).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(await verifyPassword("una-clave-larga", hash)).toBe(true);
    expect(await verifyPassword("otra-clave", hash)).toBe(false);
  });

  it("usa una sal distinta cada vez: dos hashes de la misma clave no coinciden", async () => {
    expect(await hashPassword("igual")).not.toBe(await hashPassword("igual"));
  });

  it("un hash mal formado nunca valida", async () => {
    expect(await verifyPassword("x", "texto-plano")).toBe(false);
    expect(await verifyPassword("x", "scrypt$a$b$c$sal$hash")).toBe(false);
  });
});

describe("credenciales", () => {
  it("normaliza el correo (espacios y mayúsculas)", () => {
    const parsed = signInSchema.parse({ email: "  Ana@Example.COM ", password: "x" });
    expect(parsed.email).toBe("ana@example.com");
  });

  it("explica cada error junto a su campo", () => {
    const result = signUpSchema.safeParse({ name: "A", email: "no-es-correo", password: "corta" });
    expect(result.success).toBe(false);
    expect(toFieldErrors(result.error!)).toEqual({
      name: "Escribe un nombre de al menos 2 letras.",
      email: "Escribe un correo válido, como nombre@dominio.com.",
      password: "Usa al menos 10 caracteres.",
    });
  });

  it("rechaza contraseñas enormes (scrypt no debe trabajar con megas de texto)", () => {
    const result = signInSchema.safeParse({ email: "a@b.co", password: "x".repeat(129) });
    expect(result.success).toBe(false);
  });

  it("lee solo los campos de texto del formulario", () => {
    const data = new FormData();
    data.set("email", "a@b.co");
    data.set("archivo", new Blob(["x"]));
    expect(formFields(data, ["email", "archivo", "falta"])).toEqual({
      email: "a@b.co",
      archivo: undefined,
      falta: undefined,
    });
  });
});

describe("limitador de intentos", () => {
  it("permite N intentos por ventana y dice cuánto esperar", async () => {
    let now = 0;
    const store = createMemoryAttemptStore();
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, store, now: () => now });

    expect(await limiter.consume("ip")).toEqual({ allowed: true });
    expect(await limiter.consume("ip")).toEqual({ allowed: true });
    now = 400;
    expect(await limiter.consume("ip")).toEqual({ allowed: false, retryAfterMs: 600 });
    now = 1001;
    expect(await limiter.consume("ip")).toEqual({ allowed: true });
  });

  it("cada clave tiene su propio contador y se puede reiniciar", async () => {
    const store = createMemoryAttemptStore();
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, store, now: () => 0 });
    await limiter.consume("a");
    expect((await limiter.consume("b")).allowed).toBe(true);
    await limiter.reset("a");
    expect((await limiter.consume("a")).allowed).toBe(true);
  });
});

describe("dónde se guardan las cuentas", () => {
  it("con DATABASE_URL, en Postgres", () => {
    expect(readStorageConfig({ DATABASE_URL: "postgres://x", NODE_ENV: "production" })).toEqual({
      kind: "postgres",
      url: "postgres://x",
    });
  });

  it("en desarrollo, sin base de datos, en memoria", () => {
    expect(readStorageConfig({ NODE_ENV: "development" })).toEqual({ kind: "memory" });
  });

  it("en producción sin base de datos no arranca: mejor un error que perder cuentas", () => {
    expect(() => readStorageConfig({ NODE_ENV: "production" })).toThrow(/DATABASE_URL/);
    expect(readStorageConfig({ NODE_ENV: "production", AUTH_STORAGE: "memory" })).toEqual({
      kind: "memory",
    });
  });
});
