import { Router } from 'express';
import { getPlatformAnalytics } from '../controllers/analyticsController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/overview', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN'), getPlatformAnalytics);

export default router;
