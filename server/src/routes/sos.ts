import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { cancelSos, sendHeartbeat, triggerSos } from '../controllers/sos.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.use(authenticate);
router.post('/trigger', asyncHandler(triggerSos));
router.post('/heartbeat', asyncHandler(sendHeartbeat));
router.post('/cancel', asyncHandler(cancelSos));

export default router;

