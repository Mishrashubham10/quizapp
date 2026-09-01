import { validate } from './../../middleware/validate';
import { Router } from 'express'
import { authenticate } from '../auth/auth.middleware';
import { getProfile, updateProfile } from './profile.controller';
import { updateProfileSchema } from './profile.validation';

const router = Router()

router.get(
    '/',
    authenticate,
    getProfile
);

router.patch(
    '/',
    authenticate,
    validate(updateProfileSchema),
    updateProfile,
)

export default router;