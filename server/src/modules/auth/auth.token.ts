import jwt, { SignOptions } from 'jsonwebtoken';

interface AccessTokenPayload {
  userId: string;
  type: 'access';
}

interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  type: 'refresh';
}

const ACCESS_TOKEN_EXPIRES_IN: SignOptions['expiresIn'] = '15m';

const REFRESH_TOKEN_EXPIRES_IN: SignOptions['expiresIn'] = '7d';

// ============= GENERATE-ACCESS-TOKEN ===============
export function generateAccessToken(userId: string): string {
  return jwt.sign(
    {
      userId,
      type: 'access',
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  );
}

// ============= GENERATE-REFRESH-TOKEN ===============
export function generateRefreshToken(
  userId: string,
  sessionId: string,
): string {
  return jwt.sign(
    {
      userId,
      sessionId,
      type: 'refresh',
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    },
  );
}

// ============= VEFIGY-ACCESS-TOKEN ===============
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!,
  ) as AccessTokenPayload;
}

// ============= VERIFY-REFRESH-TOKEN ===============
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!,
  ) as RefreshTokenPayload;
}