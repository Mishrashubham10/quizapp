import { Request, Response } from 'express';
import { getUserId } from '../../shared/utils/get-user-id';
import { profileService } from './profile.module';

/**
 * GET-PROFILE-CONTROLLER
 * ENDPOINT - /api/v1/profile
 * METHOD - GET
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const profile = await profileService.getProfile(userId);

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);

    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Profile not found',
    });
  }
};

/**
 * UPDATE-PROFILE-CONTROLLER
 * ENDPOINT - /api/v1/profile/:id
 * METHOD - PUT
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const profile = await profileService.updateProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    console.log('Update profile error', error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Unable to update profile',
    });
  }
};