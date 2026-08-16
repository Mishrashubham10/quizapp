import { Router } from 'express';
import { getMe, login, logout, logoutAll, refresh, register } from './auth.controller';
import { authenticate } from './auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post("/refresh", refresh);

router.post("/logout", logout);
router.post('/logout-all', authenticate, logoutAll);

export default router;