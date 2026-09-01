const { Router } = require('express');
const { getNotifications, markNotificationAsRead } = require('../controllers/notificationController');
const { authenticateJWT } = require('../middleware/auth');

const router = Router();

router.get('/', authenticateJWT, getNotifications);
router.patch('/:id/read', authenticateJWT, markNotificationAsRead);

module.exports = router;
