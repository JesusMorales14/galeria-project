export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

/** Lo único que sale del servidor: nunca el hash de la contraseña. */
export type PublicUser = Pick<User, "id" | "name" | "email" | "createdAt">;

export function toPublicUser({ id, name, email, createdAt }: User): PublicUser {
  return { id, name, email, createdAt };
}

/**
 * Persistencia de cuentas. El servicio solo conoce esta interfaz.
 * Implementaciones: Postgres (producción) y memoria (desarrollo y tests). Ver ADR 0011.
 */
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  /**
   * Crea la cuenta si el correo está libre y devuelve si se creó. La comprobación y la
   * inserción son una sola operación atómica: dos registros simultáneos con el mismo correo
   * (aunque lleguen a réplicas distintas) no pueden crear dos cuentas.
   */
  insert(user: User): Promise<boolean>;
}

export function createMemoryUserRepository(initial: User[] = []): UserRepository {
  const byId = new Map(initial.map((user) => [user.id, user]));
  const findByEmail = async (email: string) =>
    [...byId.values()].find((user) => user.email === email) ?? null;
  return {
    findById: async (id) => byId.get(id) ?? null,
    findByEmail,
    insert: async (user) => {
      if ([...byId.values()].some((existing) => existing.email === user.email)) return false;
      byId.set(user.id, user);
      return true;
    },
  };
}
