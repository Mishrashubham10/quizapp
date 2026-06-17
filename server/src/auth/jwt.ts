import jwt from 'jsonwebtoken';

// ============= GENERATE ACCESS TOKEN =============
export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m',
  });
};

// ============ GENERATE REFRESH TOKEN =============
export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};