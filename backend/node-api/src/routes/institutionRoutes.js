const { Router } = require('express');
const {
  registerInstitution,
  verifyInstitution,
  getInstitutions,
  createProgram,
  createBatch,
} = require('../controllers/institutionController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = Router();

router.post('/register', registerInstitution);
router.get('/', authenticateJWT, getInstitutions);
router.patch('/:id/verify', authenticateJWT, authorizeRoles('SUPER_ADMIN'), verifyInstitution);
router.post('/programs', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN'), createProgram);
router.post('/batches', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN'), createBatch);

module.exports = router;
