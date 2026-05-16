import { AuthProvider, User } from '@prisma/client';
import { serializeUser } from './serialization';

describe('serializeUser', () => {
  it('exposes only safe public fields (no password hash, no provider id)', () => {
    const user: User = {
      id: 'u_1',
      email: 'a@b.com',
      displayName: 'Alice',
      provider: AuthProvider.EMAIL,
      providerId: 'secret-provider-id',
      passwordHash: 'should-not-leak',
      isBanned: false,
      banReason: null,
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-02T00:00:00Z'),
      lastSeenAt: null,
    };
    const serialized = serializeUser(user);
    expect(serialized).toEqual({
      id: 'u_1',
      email: 'a@b.com',
      displayName: 'Alice',
      provider: AuthProvider.EMAIL,
      isBanned: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    expect(JSON.stringify(serialized)).not.toContain('should-not-leak');
    expect(JSON.stringify(serialized)).not.toContain('secret-provider-id');
  });
});
