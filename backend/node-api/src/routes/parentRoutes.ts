import { Router } from 'express';
import { getLinkedChildren, linkChildAccount, getChildWeeklyReport } from '../controllers/parentController';
import { authenticateJWT, authorizeRoles, parentReadOnlyGuard } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT, parentReadOnlyGuard);

router.get('/children', authorizeRoles('PARENT', 'SUPER_ADMIN'), getLinkedChildren);
router.post('/link-child', authorizeRoles('PARENT'), linkChildAccount);
router.get('/reports/weekly/:studentId', getChildWeeklyReport);

export default router;
