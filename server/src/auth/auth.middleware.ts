import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET!,
    ) as JWTPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};