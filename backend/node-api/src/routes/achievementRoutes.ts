import { Router } from 'express';
import { getAchievements, getStudentAchievements } from '../controllers/achievementController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/', getAchievements);
router.get('/student/:studentId', authenticateJWT, getStudentAchievements);
router.get('/my', authenticateJWT, getStudentAchievements);

export default router;
