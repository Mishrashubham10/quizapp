import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from './auth.token';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const payload = verifyAccessToken(accessToken);

    if (payload.type !== 'access' || !payload.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
      });
    }

    (req as AuthenticatedRequest).user = {
      id: payload.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
};