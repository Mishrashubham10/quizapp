import { prisma } from './../lib/prisma';

// ========== ADD MEMBER ==========
export const addMember = async (
  roomId: string,
  socketId: string,
  userId: string,
) => {
  return prisma.roomMember.upsert({
    where: {
      roomId_userId: {
        roomId,
        userId,
      },
    },
    update: {
      socketId,
    },
    create: {
      roomId,
      socketId,
      userId,
    },
  });
};

// ============ REMOVE MEMBER ===========
export const removeMember = async (
  socketId: string,
) => {
  return prisma.roomMember.deleteMany({
    where: {
      socketId,
    },
  });
};

// ========== GET ALL MEMBERS ==========
export const getMembers = async (
  roomId: string,
) => {
  return prisma.roomMember.findMany({
    where: {
      roomId,
    },
    include: {
      user: true,
    },
  });
};
