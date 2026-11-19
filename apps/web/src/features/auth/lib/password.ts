import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * Contraseñas con scrypt (función de derivación lenta y con coste de memoria, incluida en
 * Node: sin dependencias nativas). Formato almacenado, autodescriptivo para poder subir
 * los parámetros en el futuro sin invalidar los hashes antiguos:
 *   scrypt$N$r$p$sal$hash   (sal y hash en base64url)
 */
const PARAMS = { N: 16_384, r: 8, p: 1 } as const;
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

function derive(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, options, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await derive(password, salt, PARAMS);
  return [
    "scrypt",
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("base64url"),
    key.toString("base64url"),
  ].join("$");
}

function parse(stored: string) {
  const [scheme, n, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return null;
  const options = { N: Number(n), r: Number(r), p: Number(p) };
  if (!Object.values(options).every(Number.isSafeInteger)) return null;
  return { options, salt: Buffer.from(salt, "base64url"), hash: Buffer.from(hash, "base64url") };
}

/** Compara en tiempo constante: el tiempo de respuesta no revela cuántos bytes coinciden. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parsed = parse(stored);
  if (!parsed) return false;
  const key = await derive(password, parsed.salt, parsed.options);
  return key.length === parsed.hash.length && timingSafeEqual(key, parsed.hash);
}
