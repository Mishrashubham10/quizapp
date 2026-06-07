import { prisma } from './../lib/prisma';

// =========== CREATE ROOM ===========
export const createRoom = async (roomId: string, hostId: string) => {
  return prisma.room.create({
    data: {
      id: roomId,
      code: roomId,
      hostId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
};

// =========== GET ROOMS =============
export const getRooms = async () => {
    return prisma.room.findMany();
}

// =========== GET ROOM ============
export const getRoom = async (roomId: string) => {
  return prisma.room.findUnique({
    where: {
      id: roomId,
    },

    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
};

// ============ DELETE ROOM ===========
export const deleteRoom = async (roomId: string) => {
  return prisma.room.delete({
    where: {
      id: roomId,
    },
  });
};

// =============== UPDATE ROOM ============
export const updateRoom = async (
  roomId: string,
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED',
) => {
  return prisma.room.update({
    where: {
      id: roomId,
    },

    data: {
      status,
    },
  });
};

// ========== UPDATE ROOM STATUS =============
export const updateRoomStatus = async (
  roomId: string,
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED',
) => {
  return prisma.room.update({
    where: {
      id: roomId,
    },

    data: {
      status,
    },
  });
};
