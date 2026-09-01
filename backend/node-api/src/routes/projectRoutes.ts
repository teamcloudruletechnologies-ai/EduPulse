import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
} from '../controllers/projectController';
import { authenticateJWT, parentReadOnlyGuard } from '../middleware/auth';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authenticateJWT, parentReadOnlyGuard, createProject);
router.patch('/:id/status', authenticateJWT, parentReadOnlyGuard, updateProjectStatus);

export default router;
