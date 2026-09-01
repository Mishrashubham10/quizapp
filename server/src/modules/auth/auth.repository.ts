import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class AuthRepository {
  constructor(private readonly db = prisma) {}

  // =============== USER-REPO =============
  async findUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserByUsername(username: string) {
    return this.db.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findUserById(id: string) {
    return this.db.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.db.user.create({
      data,
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.db.user.update({
      where: {
        id,
      },
      data,
    });
  }

  //   ============ AUTH-SESSION ============
  async createAuthSession(data: Prisma.AuthSessionCreateInput) {
    return this.db.authSession.create({
      data,
    });
  }

  async findAuthSessionById(id: string) {
    return this.db.authSession.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async revokeAuthSession(id: string) {
    return this.db.authSession.update({
      where: {
        id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllAuthSession(userId: string) {
    return this.db.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async rotateAuthSession(
    oldSessionId: string,
    newSessionId: string,
    newRefreshTokenHash: string,
    expiresAt: Date,
  ) {
    return this.db.$transaction(async (tax) => {
      const currentSession = await tax.authSession.findUnique({
        where: {
          id: oldSessionId,
        },
      });

      if (!currentSession) {
        throw new Error('Session not found');
      }

      if (currentSession.revokedAt) {
        throw new Error('Session has been revoked');
      }

      if (currentSession.expiresAt <= new Date()) {
        throw new Error('Session has expired');
      }

      // REVOKE CURRENT REFRESH SESSION
      await tax.authSession.update({
        where: {
          id: oldSessionId,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      // CREATE A NEW REFRESH TOKEN
      const newSession = await tax.authSession.create({
        data: {
          id: newSessionId,
          userId: currentSession.userId,
          refreshTokenHash: newRefreshTokenHash,
          userAgent: currentSession.userAgent,
          ipAddress: currentSession.ipAddress,
          expiresAt,
        },
      });

      return newSession;
    });
  }

  // ============ PASSWORD-RESET ============
  async createPasswordResetToken(data: Prisma.PasswordResetTokenCreateInput) {
    return this.db.passwordResetToken.create({
      data,
    });
  }

  async findPasswordResetToken(tokenHash: string) {
    return this.db.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },

      include: {
        user: true,
      },
    });
  }

  async markPasswordResetTokenUser(id: string) {
    return this.db.passwordResetToken.update({
      where: {
        id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async daletePasswordResetToken(userId: string) {
    return this.db.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async findUserForPasswordChange(userId: string) {
    return this.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        passwordHash: true,
        status: true,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });
  }
}