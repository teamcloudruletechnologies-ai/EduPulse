import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  submitQuizAttempt,
  updateLearningProgress,
} from '../controllers/learningController';
import { authenticateJWT, parentReadOnlyGuard } from '../middleware/auth';

const router = Router();

router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/quiz/attempt', authenticateJWT, parentReadOnlyGuard, submitQuizAttempt);
router.post('/progress', authenticateJWT, parentReadOnlyGuard, updateLearningProgress);

export default router;
