import { Router } from 'express';

import { getMe, login, logout, refresh, register } from './auth.controller';

import { protect } from './auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post("/logout", logout);
router.get('/me', protect, getMe);
router.post("/refresh", refresh);

export default router;