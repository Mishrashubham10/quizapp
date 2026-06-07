import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

// =========== REGISTER SERVICE =============
export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error) {
    console.error(error);

    throw error;
  }
};