import { Router } from 'express';
import { sendMessage, getConversation } from '../controllers/messageController';
import { authenticateJWT, parentReadOnlyGuard } from '../middleware/auth';

const router = Router();

router.post('/', authenticateJWT, parentReadOnlyGuard, sendMessage);
router.get('/conversation/:otherUserId', authenticateJWT, getConversation);

export default router;
