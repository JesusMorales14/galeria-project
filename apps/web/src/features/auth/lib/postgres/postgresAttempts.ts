import type { AttemptStore } from "../rateLimiter";
import { toMillis, toTimestamp, type SqlClient } from "./sqlClient";

export function createPostgresAttemptStore(db: SqlClient): AttemptStore {
  return {
    async record(key, at) {
      await db.query("INSERT INTO sign_in_attempts (key, attempted_at) VALUES ($1, $2)", [
        key,
        toTimestamp(at),
      ]);
    },
    async countSince(key, since) {
      const { rows } = await db.query<{ count: number | string; oldest: Date | string | null }>(
        `SELECT count(*) AS count, min(attempted_at) AS oldest FROM sign_in_attempts
         WHERE key = $1 AND attempted_at >= $2`,
        [key, toTimestamp(since)],
      );
      return { count: Number(rows[0]?.count ?? 0), oldest: toMillis(rows[0]?.oldest ?? null) };
    },
    async clear(key) {
      await db.query("DELETE FROM sign_in_attempts WHERE key = $1", [key]);
    },
    async prune(before) {
      await db.query("DELETE FROM sign_in_attempts WHERE attempted_at < $1", [toTimestamp(before)]);
    },
  };
}
