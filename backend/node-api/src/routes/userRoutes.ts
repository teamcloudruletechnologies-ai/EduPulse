import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/all', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'INSTITUTION_ADMIN'), getAllUsers);

export default router;
