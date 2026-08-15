import { Prisma, Room } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class RoomRepository {
  constructor(private readonly db = prisma) {}

  async createWithHost(
    roomData: Prisma.RoomCreateInput,
    hostId: string,
    socketId: string,
  ): Promise<Room> {
    return this.db.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: roomData,
      });

      await tx.roomMember.create({
        data: {
          roomId: room.id,
          userId: hostId,
          socketId,
        },
      });

      return room;
    });
  }

  // ============ FIND BY ID ==========
  async findById(id: string) {
    return this.db.room.findUnique({
      where: { id },
    });
  }

  // =========== FIND BY CODE ==========
  async findByCode(code: string) {
    return this.db.room.findUnique({
      where: { code },
    });
  }

  // ============ FIND BY CODE WITH MEMBERS ==========
  async findByCodeWithMembers(code: string) {
    return this.db.room.findUnique({
      where: { code },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    });
  }

  // =========== FIND BY HOSTID ==============
  async findByHostId(hostId: string) {
    return this.db.room.findMany({
      where: {
        hostId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========== UPDATE ===========
  async update(id: string, data: Prisma.RoomUpdateInput) {
    return this.db.room.update({
      where: { id },
      data,
    });
  }

  // ================ DELETE ==============
  async delete(id: string) {
    return this.db.room.delete({
      where: { id },
    });
  }
}