import { Router } from 'express';
import { getStudentDashboard, getStudentsList } from '../controllers/studentController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateJWT, getStudentDashboard);
router.get('/dashboard/:studentId', authenticateJWT, getStudentDashboard);
router.get('/all', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'COORDINATOR'), getStudentsList);

export default router;
