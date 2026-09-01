const { Router } = require('express');
const { getStudentDashboard, getStudentsList } = require('../controllers/studentController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = Router();

router.get('/dashboard', authenticateJWT, getStudentDashboard);
router.get('/dashboard/:studentId', authenticateJWT, getStudentDashboard);
router.get('/all', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'COORDINATOR'), getStudentsList);

module.exports = router;
