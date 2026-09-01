const { Router } = require('express');
const { getPlatformAnalytics } = require('../controllers/analyticsController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = Router();

router.get('/overview', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN'), getPlatformAnalytics);

module.exports = router;
