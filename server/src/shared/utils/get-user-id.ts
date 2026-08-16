import { Request } from 'express';

export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new Error('Authenticated user ID is missing');
  }

  return req.userId;
}