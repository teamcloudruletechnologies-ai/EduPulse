const { Router } = require('express');
const { getMentors, bookMentorSession, addMentorFeedback } = require('../controllers/mentorController');
const { authenticateJWT, parentReadOnlyGuard } = require('../middleware/auth');

const router = Router();

router.get('/', getMentors);
router.post('/session', authenticateJWT, parentReadOnlyGuard, bookMentorSession);
router.post('/feedback', authenticateJWT, addMentorFeedback);

module.exports = router;
