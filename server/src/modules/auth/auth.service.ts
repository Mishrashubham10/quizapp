import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { AuthRepository } from './auth.repository';
import { AuthUser, LoginInput, RegisterInput } from './auth.types';
import { comparePassword, hashPassword } from './auth.password';
import {
  generatePasswordResetToken,
  generateRefreshSessionId,
  hashPasswordResetToken,
  hashRefreshToken,
} from './auth.reset';
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

  // ============ RESET-PASSWORD-SERVICE ============
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.authRepository.findUserForPasswordChange(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account is unavailable');
    }

    const isCurrentPwdValid = await comparePassword(
      currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPwdValid) {
      throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await hashPassword(newPassword);

    await this.authRepository.updatePassword(userId, newPasswordHash);

    await this.authRepository.revokeAllAuthSession(userId);
  }

  // ============ FORGOT-PASSWORD-SERVICE ============
  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.authRepository.findUserByEmail(normalizedEmail);

    /**
     * IMPORTANT:
     * Don't reveall whether the email exists.
     */
    if (!user || user.status !== 'ACTIVE') {
      return;
    }

    // INVALIDATE PREVIOUS RESET TOKEN
    await this.authRepository.invalidatePasswordResetTokens(user.id);

    // GENERATE PLAIN TOKEN
    const token = generatePasswordResetToken();

    // STORE ONLY HASH
    const tokenHash = hashPasswordResetToken(token);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.authRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    /**
     * TEMPORARY:
     * WE'LL REPLACE THIS WITH EMAIL DELIVERY.
     */
    console.log(`PASSWORD RESET TOKEN for ${user.email}:`, token);
  }

  // =========== RESET-PWD-SERVICE ============
  async resetPassword(token: string, newPassword: string) {
    const tokenHash = hashPasswordResetToken(token);

    const resetToken =
      await this.authRepository.findPasswordResetToken(tokenHash);

    if (!resetToken) {
      throw new Error('Invalid or expired reset token');
    }

    if (resetToken.usedAt) {
      throw new Error('Invalid or expired reset token');
    }

    if (resetToken.expiresAt.getTime() <= Date.now()) {
      throw new Error('Invalid or expired reset token');
    }

    const passwordHash = await hashPassword(newPassword);

    await this.authRepository.resetPassword(
      resetToken.userId,
      resetToken.id,
      passwordHash,
    );
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