const { Router } = require('express');
const { sendMessage, getConversation } = require('../controllers/messageController');
const { authenticateJWT, parentReadOnlyGuard } = require('../middleware/auth');

const router = Router();

router.post('/', authenticateJWT, parentReadOnlyGuard, sendMessage);
router.get('/conversation/:otherUserId', authenticateJWT, getConversation);

module.exports = router;
