import { Router } from 'express';
import { registerDevice, loginDevice } from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.post('/register', asyncHandler(registerDevice));
router.post('/login', asyncHandler(loginDevice));

export default router;

