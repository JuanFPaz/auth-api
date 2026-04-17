export type RefreshTokenRecord = {
  userId: number;
  tokenHash: string;
  jti: string;
  expiresAt: Date;
  ip: string;
  userAgent: string;
};

export type RefreshTokenBase = {
  tokenHash: string;
  jti: string;
};

export type RefreshRotation = RefreshTokenBase & {
  revokedAt: Date;
  replacedBy: string;
};

export type RefreshRevoke = RefreshTokenBase & {
  revokedAt: Date;
};

export type PersistRefresh = {
  id: number;
  refreshToken: string;
  jti: string;
  ip: string;
  userAgent: string;
};