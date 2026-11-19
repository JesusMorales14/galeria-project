import type { User, UserRepository } from "../users";
import type { SqlClient } from "./sqlClient";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date | string;
};

const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  createdAt: new Date(row.created_at).toISOString(),
});

export function createPostgresUserRepository(db: SqlClient): UserRepository {
  const first = ({ rows }: { rows: UserRow[] }) => (rows[0] ? toUser(rows[0]) : null);
  return {
    findById: async (id) =>
      first(await db.query<UserRow>("SELECT * FROM users WHERE id = $1", [id])),
    findByEmail: async (email) =>
      first(await db.query<UserRow>("SELECT * FROM users WHERE email = $1", [email])),
    async insert(user) {
      // ON CONFLICT: el índice único del correo resuelve la carrera dentro de Postgres.
      const { rows } = await db.query(
        `INSERT INTO users (id, name, email, password_hash, created_at)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING RETURNING id`,
        [user.id, user.name, user.email, user.passwordHash, user.createdAt],
      );
      return rows.length === 1;
    },
  };
}
