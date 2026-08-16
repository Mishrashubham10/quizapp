import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { AuthRepository } from './auth.repository';
import { AuthUser, LoginInput, RegisterInput } from './auth.types';
import { comparePassword, hashPassword } from './auth.password';
import { generateRefreshSessionId, hashRefreshToken } from './auth.reset';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './auth.token';

// =========== AUTH-SERVICE ===========
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  // ============ REGISTER-SERVICE ============
  async register(input: RegisterInput, userAgent?: string, ipAddress?: string) {
    const username = input.username.trim();
    const displayName = input.displayName.trim();
    const email = input.email.trim().toLowerCase();

    if (!username || !displayName || !email) {
      throw new Error('All fields are required');
    }

    const existingEmail = await this.authRepository.findUserByEmail(email);

    if (existingEmail) {
      throw new Error('Unable to create account with these details');
    }

    const existingUsername =
      await this.authRepository.findUserByUsername(username);

    if (existingUsername) {
      throw new Error('Unable to create account with these details');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await this.authRepository.createUser({
      username,
      displayName,
      email,
      passwordHash,
    });

    const sessionId = generateRefreshSessionId();
    const refreshToken = generateRefreshToken(user.id, sessionId);

    await this.authRepository.createAuthSession({
      id: sessionId,
      user: {
        connect: {
          id: user.id,
        },
      },
      refreshTokenHash: hashRefreshToken(refreshToken),
      userAgent,
      ipAddress,
      expiresAt: this.getRefreshTokenExpiry(),
    });

    const accessToken = generateAccessToken(user.id);

    return {
      user: this.toAuthUser(user),
      accessToken,
      refreshToken,
    };
  }

  // =========== LOGIN-SERVICE ==============
  async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    const email = input.email.trim().toLowerCase();

    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account is unavailable');
    }

    const passwordValid = await comparePassword(
      input.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new Error('Invalid email or password');
    }

    const sessionId = generateRefreshSessionId();
    const refreshToken = generateRefreshToken(user.id, sessionId);

    await this.authRepository.createAuthSession({
      id: sessionId,
      user: {
        connect: {
          id: user.id,
        },
      },
      refreshTokenHash: hashRefreshToken(refreshToken),
      userAgent,
      ipAddress,
      expiresAt: this.getRefreshTokenExpiry(),
    });

    await this.authRepository.updateUser(user.id, {
      lastLoginAt: new Date(),
    });

    const accessToken = generateAccessToken(user.id);

    return {
      user: this.toAuthUser(user),
      accessToken,
      refreshToken,
    };
  }

  // =========== GET-CURRENT-USER-SERVICE ============
  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account is unavailable');
    }

    return this.toAuthUser(user);
  }

  // =========== REFRESH-TOKEN-SERVICE =============
  async refresh(refreshToken: string, userAgent?: string, ipAddress?: string) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new Error('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh' || !payload.sessionId || !payload.userId) {
      throw new Error('Invalid refresh token');
    }

    const session = await this.authRepository.findAuthSessionById(
      payload.sessionId,
    );

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.revokedAt) {
      throw new Error('Session has been revoked');
    }

    if (session.expiresAt <= new Date()) {
      throw new Error('Session has expired');
    }

    if (session.userId !== payload.userId) {
      throw new Error('Invalid refresh session');
    }

    const tokenHash = hashRefreshToken(refreshToken);

    if (tokenHash !== session.refreshTokenHash) {
      throw new Error('Invalid refresh token');
    }

    if (session.user.status !== 'ACTIVE') {
      throw new Error('Account is unavailable');
    }

    const newSessionId = generateRefreshSessionId();
    const newRefreshToken = generateRefreshToken(session.userId, newSessionId);

    await this.authRepository.rotateAuthSession(
      session.id,
      newSessionId,
      hashRefreshToken(newRefreshToken),
      this.getRefreshTokenExpiry(),
    );

    const accessToken = generateAccessToken(session.userId);

    return {
      user: this.toAuthUser(session.user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // ============ LOGOUT-SERVICE =============
  async logout(refreshToken: string) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return;
    }

    if (payload.type !== 'refresh' || !payload.sessionId) {
      return;
    }

    const session = await this.authRepository.findAuthSessionById(
      payload.sessionId,
    );

    if (!session) return;

    if (session.revokedAt) return;

    const tokenHash = hashRefreshToken(refreshToken);

    if (tokenHash !== session.refreshTokenHash) return;

    await this.authRepository.revokeAuthSession(session.id);
  }

  // =========== LOGOUT-ALL-SERVICE ============
  async logoutAll(userId: string) {
    await this.authRepository.revokeAllAuthSession(userId);
  }

  // ============= HELPERS ============
  private getRefreshTokenExpiry(): Date {
    const expiry = new Date();

    expiry.setDate(expiry.getDate() + 7);

    return expiry;
  }

  private toAuthUser(user: {
    id: string;
    username: string;
    displayName: string;
    email: string;
    avatarUrl: string | null;
    status: string;
  }): AuthUser {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      status: user.status,
    };
  }
}