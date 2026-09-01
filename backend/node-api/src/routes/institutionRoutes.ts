import { Router } from 'express';
import {
  registerInstitution,
  verifyInstitution,
  getInstitutions,
  createProgram,
  createBatch,
} from '../controllers/institutionController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.post('/register', registerInstitution);
router.get('/', authenticateJWT, getInstitutions);
router.patch('/:id/verify', authenticateJWT, authorizeRoles('SUPER_ADMIN'), verifyInstitution);
router.post('/programs', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN'), createProgram);
router.post('/batches', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN'), createBatch);

export default router;
