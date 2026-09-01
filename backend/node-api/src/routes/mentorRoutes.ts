import { Router } from 'express';
import { getMentors, bookMentorSession, addMentorFeedback } from '../controllers/mentorController';
import { authenticateJWT, parentReadOnlyGuard } from '../middleware/auth';

const router = Router();

router.get('/', getMentors);
router.post('/session', authenticateJWT, parentReadOnlyGuard, bookMentorSession);
router.post('/feedback', authenticateJWT, addMentorFeedback);

export default router;
