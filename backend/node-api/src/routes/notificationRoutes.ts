import { Router } from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, getNotifications);
router.patch('/:id/read', authenticateJWT, markNotificationAsRead);

export default router;
