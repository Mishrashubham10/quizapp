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

      members: {
        create: {
          userId: hostId,
        },
      },
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

// JOIN ROOM SERVICE
export const joinRoom = async (code: string, userId: string) => {
  const room = await prisma.room.findUnique({
    where: {
      code,
    },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  const existingMember = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId: room.id,
        userId,
      },
    },
  });

  if (!existingMember) {
    await prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId,
      },
    });
  }

  return prisma.room.findUnique({
    where: {
      id: room.id,
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