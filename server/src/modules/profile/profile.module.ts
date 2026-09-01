import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

const profileRepository = new ProfileRepository();

export const profileService = new ProfileService(profileRepository);