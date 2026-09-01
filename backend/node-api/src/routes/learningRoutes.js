const { Router } = require('express');
const {
  getCourses,
  getCourseById,
  submitQuizAttempt,
  updateLearningProgress,
} = require('../controllers/learningController');
const { authenticateJWT, parentReadOnlyGuard } = require('../middleware/auth');

const router = Router();

router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/quiz/attempt', authenticateJWT, parentReadOnlyGuard, submitQuizAttempt);
router.post('/progress', authenticateJWT, parentReadOnlyGuard, updateLearningProgress);

module.exports = router;
