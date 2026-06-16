import { Router } from 'express';
import { createRoom, getRoomByCode } from './rooms.controller';

import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', createRoom);

router.get('/:code', getRoomByCode);

export default router;