import type { RefreshTokenRecord, RefreshTokenStore } from "../refreshTokens";
import { toMillis, toTimestamp, type SqlClient } from "./sqlClient";

type TokenRow = {
  token_id: string;
  family_id: string;
  user_id: string;
  expires_at: Date | string;
  used_at: Date | string | null;
  revoked: boolean;
};

const toRecord = (row: TokenRow): RefreshTokenRecord => ({
  tokenId: row.token_id,
  familyId: row.family_id,
  userId: row.user_id,
  expiresAt: toMillis(row.expires_at)!,
  usedAt: toMillis(row.used_at),
  revoked: row.revoked,
});

export function createPostgresRefreshTokenStore(db: SqlClient): RefreshTokenStore {
  return {
    async issue(record) {
      await db.query(
        `INSERT INTO refresh_tokens (token_id, family_id, user_id, expires_at, used_at, revoked)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          record.tokenId,
          record.familyId,
          record.userId,
          toTimestamp(record.expiresAt),
          record.usedAt === null ? null : toTimestamp(record.usedAt),
          record.revoked,
        ],
      );
    },
    async find(tokenId) {
      const { rows } = await db.query<TokenRow>(
        "SELECT * FROM refresh_tokens WHERE token_id = $1",
        [tokenId],
      );
      return rows[0] ? toRecord(rows[0]) : null;
    },
    async markUsed(tokenId, at) {
      // Compare-and-set atómico: solo una petición puede pasar used_at de NULL a una fecha.
      const { rows } = await db.query(
        `UPDATE refresh_tokens SET used_at = $2
         WHERE token_id = $1 AND used_at IS NULL AND NOT revoked RETURNING token_id`,
        [tokenId, toTimestamp(at)],
      );
      return rows.length === 1;
    },
    async revokeFamily(familyId) {
      await db.query("UPDATE refresh_tokens SET revoked = true WHERE family_id = $1", [familyId]);
    },
    async revokeUser(userId) {
      await db.query("UPDATE refresh_tokens SET revoked = true WHERE user_id = $1", [userId]);
    },
    async activeFamilies(userId, now) {
      const { rows } = await db.query<{ count: number | string }>(
        `SELECT count(DISTINCT family_id) AS count FROM refresh_tokens
         WHERE user_id = $1 AND NOT revoked AND used_at IS NULL AND expires_at > $2`,
        [userId, toTimestamp(now)],
      );
      return Number(rows[0]?.count ?? 0);
    },
    async prune(now) {
      await db.query("DELETE FROM refresh_tokens WHERE expires_at <= $1", [toTimestamp(now)]);
    },
  };
}
