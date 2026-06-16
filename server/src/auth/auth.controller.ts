import { Request, Response } from 'express';
import { registerUser, loginUser, getCurrentUser } from './auth.service';
import { generateAccessToken, generateRefreshToken } from './jwt';

import jwt from 'jsonwebtoken';

/*
======== REGISTER CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/REGISTER =========
*/
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    console.log(req.body);

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const user = await registerUser(username, email, password);

    return res.status(201).json({
      message: 'User registered successfully',

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
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

    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const user = await loginUser(email, password);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
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
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.json({
    message: 'Logged out successfully',
  });
};

/*
======== ME CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/ME =========
*/
export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const user = await getCurrentUser(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Something went wrong!',
    });
  }
};

/*
======== REFRESH TOKEN CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/REFRESH =========
*/
export const refresh = (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token missing',
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as {
      userId: string;
    };

    const accessToken = generateAccessToken(decoded.userId);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      message: 'Access token refreshed',
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid refresh token',
    });
  }
};