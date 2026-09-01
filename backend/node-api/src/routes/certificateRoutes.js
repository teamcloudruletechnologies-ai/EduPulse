const { Router } = require('express');
const {
  generateCertificate,
  getCertificates,
  verifyCertificatePublic,
} = require('../controllers/certificateController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = Router();

router.get('/verify/:certificateId', verifyCertificatePublic);
router.get('/', authenticateJWT, getCertificates);
router.post('/generate', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'MENTOR'), generateCertificate);

module.exports = router;
