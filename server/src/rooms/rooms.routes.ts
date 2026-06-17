import { Router } from 'express';
import { createRoom, getRoomByCode, joinRoom } from './rooms.controller';

import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', createRoom);
router.get('/:code', getRoomByCode);
router.post('/:code/join', joinRoom);

export default router;