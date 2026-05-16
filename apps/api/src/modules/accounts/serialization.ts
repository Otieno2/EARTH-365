import type { User } from '@prisma/client';

export interface SerializedUser {
  id: string;
  email: string;
  displayName: string;
  provider: User['provider'];
  isBanned: boolean;
  createdAt: string;
}

export function serializeUser(user: User): SerializedUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    provider: user.provider,
    isBanned: user.isBanned,
    createdAt: user.createdAt.toISOString(),
  };
}
