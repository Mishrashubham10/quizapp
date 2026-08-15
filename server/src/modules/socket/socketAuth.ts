import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error('Authentication required'));
    }

    const accessToken = cookies
      .split('; ')
      .find((cookie) => cookie.startsWith('accessToken='))
      ?.split('=')[1];

    if (!accessToken) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.data.user = user;

    next();
  } catch (error) {
    console.error('Socket authentication failed:', error);

    next(new Error('Invalid token'));
  }
};