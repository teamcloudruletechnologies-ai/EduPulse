const { Router } = require('express');
const { getAchievements, getStudentAchievements } = require('../controllers/achievementController');
const { authenticateJWT } = require('../middleware/auth');

const router = Router();

router.get('/', getAchievements);
router.get('/student/:studentId', authenticateJWT, getStudentAchievements);
router.get('/my', authenticateJWT, getStudentAchievements);

module.exports = router;
