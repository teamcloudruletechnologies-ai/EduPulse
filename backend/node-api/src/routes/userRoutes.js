const { Router } = require('express');
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = Router();

router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/all', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN'), getAllUsers);

module.exports = router;
