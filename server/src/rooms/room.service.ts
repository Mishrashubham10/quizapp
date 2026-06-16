import crypto from 'crypto';

import { prisma } from '../lib/prisma';

// CREATE ROOM SERVICE
export const createRoom = async (hostId: string) => {
  let code = '';

  let exists = true;

  while (exists) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase();

    const room = await prisma.room.findUnique({
      where: {
        code,
      },
    });

    exists = !!room;
  }

  return prisma.room.create({
    data: {
      code,

      hostId,
    },

    include: {
      host: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

// GET ROOM BY CODE SERVICE
export const getRoomByCode = async (code: string) => {
  return prisma.room.findUnique({
    where: {
      code,
    },

    include: {
      host: {
        select: {
          id: true,
          username: true,
        },
      },

      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
};