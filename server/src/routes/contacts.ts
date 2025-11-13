import { Router } from 'express';
import { createContact, deleteContact, listContacts } from '../controllers/contacts.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.use(authenticate);
router.get('/', asyncHandler(listContacts));
router.post('/', asyncHandler(createContact));
router.delete('/:id', asyncHandler(deleteContact));

export default router;

