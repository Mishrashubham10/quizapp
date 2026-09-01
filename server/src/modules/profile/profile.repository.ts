import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class ProfileRepository {
  constructor(private readonly db = prisma) {}

  async findById(id: string) {
    return this.db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.db.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
      },
    });
  }
}