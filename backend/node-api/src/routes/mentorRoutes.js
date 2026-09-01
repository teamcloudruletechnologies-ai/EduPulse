const { Router } = require('express');
const {
  getMentors,
  bookMentorSession,
  addMentorFeedback,
  getSessions,
  createSession,
  deleteSession,
} = require('../controllers/mentorController');
const { authenticateJWT, parentReadOnlyGuard } = require('../middleware/auth');

const router = Router();

router.get('/', getMentors);
router.get('/sessions', getSessions);
router.post('/sessions', createSession);
router.delete('/sessions/:id', deleteSession);
router.post('/session', authenticateJWT, parentReadOnlyGuard, bookMentorSession);
router.post('/feedback', authenticateJWT, addMentorFeedback);

module.exports = router;
