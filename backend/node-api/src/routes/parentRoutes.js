const { Router } = require('express');
const { getLinkedChildren, linkChildAccount, getChildWeeklyReport } = require('../controllers/parentController');
const { authenticateJWT, authorizeRoles, parentReadOnlyGuard } = require('../middleware/auth');

const router = Router();

router.use(authenticateJWT, parentReadOnlyGuard);

router.get('/children', authorizeRoles('PARENT', 'SUPER_ADMIN'), getLinkedChildren);
router.post('/link-child', authorizeRoles('PARENT'), linkChildAccount);
router.get('/reports/weekly/:studentId', getChildWeeklyReport);

module.exports = router;
