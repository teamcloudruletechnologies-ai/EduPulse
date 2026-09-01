import { Router } from 'express';
import {
  generateCertificate,
  getCertificates,
  verifyCertificatePublic,
} from '../controllers/certificateController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/verify/:certificateId', verifyCertificatePublic);
router.get('/', authenticateJWT, getCertificates);
router.post('/generate', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'MENTOR'), generateCertificate);

export default router;
