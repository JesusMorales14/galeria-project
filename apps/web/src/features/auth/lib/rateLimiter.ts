/** Dónde se apuntan los intentos. Compartido (Postgres) para que el límite valga entre réplicas. */
export interface AttemptStore {
  record(key: string, at: number): Promise<void>;
  /** Intentos de la clave desde `since`, y el más antiguo de ellos. */
  countSince(key: string, since: number): Promise<{ count: number; oldest: number | null }>;
  clear(key: string): Promise<void>;
  /** Olvida los intentos anteriores a `before`. */
  prune(before: number): Promise<void>;
}

export function createMemoryAttemptStore(): AttemptStore {
  const attempts = new Map<string, number[]>();
  return {
    record: async (key, at) => void attempts.set(key, [...(attempts.get(key) ?? []), at]),
    countSince: async (key, since) => {
      const recent = (attempts.get(key) ?? []).filter((at) => at >= since);
      return { count: recent.length, oldest: recent.length > 0 ? Math.min(...recent) : null };
    },
    clear: async (key) => void attempts.delete(key),
    prune: async (before) => {
      for (const [key, list] of attempts) {
        const kept = list.filter((at) => at >= before);
        if (kept.length > 0) attempts.set(key, kept);
        else attempts.delete(key);
      }
    },
  };
}

type RateLimiterOptions = {
  limit: number;
  windowMs: number;
  store: AttemptStore;
  now?: () => number;
};

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterMs: number };

/**
 * Ventana deslizante: como mucho `limit` intentos por clave en `windowMs`.
 * Frena la fuerza bruta contra el formulario de acceso.
 */
export function createRateLimiter({ limit, windowMs, store, now = Date.now }: RateLimiterOptions) {
  return {
    async consume(key: string): Promise<RateLimitResult> {
      const current = now();
      const since = current - windowMs;
      await store.prune(since);
      const { count, oldest } = await store.countSince(key, since);
      if (count >= limit) {
        return { allowed: false, retryAfterMs: windowMs - (current - (oldest ?? current)) };
      }
      await store.record(key, current);
      return { allowed: true };
    },
    /** Tras un acceso correcto, los fallos anteriores dejan de contar. */
    reset: (key: string) => store.clear(key),
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
