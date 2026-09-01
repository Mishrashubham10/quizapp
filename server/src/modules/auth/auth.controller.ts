import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { authService } from './auth.module';
import {
  clearAuthCookies,
  getRefreshToken,
  setAuthCookies,
} from './auth.cookies';
import { AuthenticatedRequest } from './auth.middleware';
import { getUserId } from '../../shared/utils/get-user-id';
import { success } from 'zod';
import { REPLCommand } from 'node:repl';

/*
======== REGISTER CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/REGISTER =========
*/
export const register = async (req: Request, res: Response) => {
  try {
    const { username, displayName, email, password } = req.body;

    const result = await authService.register(
      {
        username,
        displayName,
        email,
        password,
      },
      req.get('user-agent') ?? undefined,
      req.ip,
    );

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: result.user,
    });
  } catch (error) {
    console.error('Register error:', error);

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

/*
======== LOGIN CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/LOGIN =========
*/
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(
      {
        email,
        password,
      },
      req.get('user-agent') ?? undefined,
      req.ip,
    );

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: result.user,
    });
  } catch (error) {
    console.log('Login error:', error);

    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : 'Login failed',
    });
  }
};

/*
======== LOGOUT CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/LOGOUT =========
*/
export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = getRefreshToken(req);

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.log('Logout error:', error);

    // STILL CLEAR COOKIES
    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
};

/*
======== ME CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/ME =========
*/
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const user = await authService.getCurrentUser(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log('Get current user error:', error);

    res.status(401).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unable to get current user',
    });
  }
};

/*
======== REFRESH TOKEN CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/REFRESH =========
*/
export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    const result = await authService.refresh(
      refreshToken,
      req.get('user-agent') ?? undefined,
      req.ip,
    );

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      user: result.user,
    });
  } catch (error) {
    console.log('Refresh error:', error);

    clearAuthCookies(res);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unable to refresh session',
    });
  }
};

/*
======== CHANGE-PWD-CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/CHANGE-PWD =========
*/
export const changePwd = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;

    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(userId, currentPassword, newPassword);

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    });
  } catch (error) {
    console.error('Change password error:', error);

    const message =
      error instanceof Error ? error.message : 'Unable to change password';

    const status =
      message === 'Current password is incorrect'
        ? 401
        : message === 'User not found'
          ? 404
          : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

/*
======== FORGOT-PWD-CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/FORGOT-PWD =========
*/
export const forgotPwd = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message:
        'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to process password reset request',
    });
  }
};

/*
======== RESET-PWD-CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/RESET-PWD =========
*/
export const resetPwd = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login again.',
    });
  } catch (error) {
    console.error('Reset password error:', error);

    const message =
      error instanceof Error ? error.message : 'Unable to reset password';

    if (message === 'Invalid or expired reset token') {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to reset password',
    });
  }
};

/*
======== LOGOUT-ALL-CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/LOGOUTALL =========
*/
export const logoutAll = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    await authService.logoutAll(userId);

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out from all devices',
    });
  } catch (error) {
    console.log('Logout all error:', error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to logout from all devices',
    });
  }
};