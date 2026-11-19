/**
 * Registro de tokens de refresco emitidos. Cada inicio de sesión abre una «familia»;
 * cada refresco consume el token actual y emite el siguiente de la misma familia.
 * Si un token ya consumido vuelve a usarse, alguien lo ha copiado: se revoca la familia.
 */
export type RefreshTokenRecord = {
  tokenId: string;
  familyId: string;
  userId: string;
  expiresAt: number;
  usedAt: number | null;
  revoked: boolean;
};

export interface RefreshTokenStore {
  issue(record: RefreshTokenRecord): Promise<void>;
  find(tokenId: string): Promise<RefreshTokenRecord | null>;
  /**
   * Consume el token si sigue sin usar y sin revocar, y devuelve si lo consiguió.
   * Es atómico: si dos peticiones (o dos réplicas) lo intentan a la vez, solo una gana.
   */
  markUsed(tokenId: string, at: number): Promise<boolean>;
  revokeFamily(familyId: string): Promise<void>;
  revokeUser(userId: string): Promise<void>;
  /** Sesiones abiertas: familias con algún token vigente y sin revocar. */
  activeFamilies(userId: string, now: number): Promise<number>;
  /** Olvida los tokens caducados: el registro no crece sin límite. */
  prune(now: number): Promise<void>;
}

export function createMemoryRefreshTokenStore(): RefreshTokenStore {
  const records = new Map<string, RefreshTokenRecord>();
  const revokeWhere = (match: (record: RefreshTokenRecord) => boolean) => {
    for (const record of records.values()) if (match(record)) record.revoked = true;
  };

  return {
    issue: async (record) => void records.set(record.tokenId, { ...record }),
    find: async (tokenId) => {
      const record = records.get(tokenId);
      return record ? { ...record } : null;
    },
    markUsed: async (tokenId, at) => {
      const record = records.get(tokenId);
      if (!record || record.usedAt !== null || record.revoked) return false;
      record.usedAt = at;
      return true;
    },
    revokeFamily: async (familyId) => revokeWhere((record) => record.familyId === familyId),
    revokeUser: async (userId) => revokeWhere((record) => record.userId === userId),
    activeFamilies: async (userId, now) => {
      const families = new Set<string>();
      for (const record of records.values()) {
        const live = !record.revoked && record.usedAt === null && record.expiresAt > now;
        if (live && record.userId === userId) families.add(record.familyId);
      }
      return families.size;
    },
    prune: async (now) => {
      for (const [tokenId, record] of records) if (record.expiresAt <= now) records.delete(tokenId);
    },
  };
}
