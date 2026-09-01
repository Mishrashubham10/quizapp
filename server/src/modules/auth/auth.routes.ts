import { Router } from 'express';
import {
  changePwd,
  getMe,
  login,
  logout,
  logoutAll,
  refresh,
  register,
} from './auth.controller';
import { authenticate } from './auth.middleware';
import { validate } from '../../middleware/validate';
import { changePasswordSchema } from './auth.validation';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/refresh', refresh);

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  changePwd,
);

router.post('/logout', logout);
router.post('/logout-all', authenticate, logoutAll);

export default router;