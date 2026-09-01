import { ProfileRepository } from './profile.repository';
import { UpdatedProfileInput } from './profile.types';

export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(userId: string) {
    const profile = await this.profileRepository.findById(userId);

    if (!profile) {
      throw new Error('Profile not found');
    }

    if (profile.status !== 'ACTIVE') {
      throw new Error('Account is unavailable');
    }

    return profile;
  }

  async updateProfile(userId: string, input: UpdatedProfileInput) {
    const currentProfile = await this.profileRepository.findById(userId);

    if (!currentProfile) {
      throw new Error('Profile not found');
    }

    if (currentProfile.status !== 'ACTIVE') {
      throw new Error('Account is unavailable');
    }

    if (input.username) {
      const existingUser = await this.profileRepository.findByUsername(
        input.username,
      );

      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username is already taken');
      }
    }

    return this.profileRepository.update(userId, {
      ...(input.username !== undefined && {
        username: input.username,
      }),

      ...(input.displayName !== undefined && {
        displayName: input.displayName,
      }),

      ...(input.avatarUrl !== undefined && {
        avatarUrl: input.avatarUrl,
      }),
    });
  }
}