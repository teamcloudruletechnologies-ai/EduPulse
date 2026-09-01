import { Router } from 'express';
import { createTask, updateTaskStatus } from '../controllers/taskController';
import { authenticateJWT, parentReadOnlyGuard } from '../middleware/auth';

const router = Router();

router.post('/', authenticateJWT, parentReadOnlyGuard, createTask);
router.patch('/:id/status', authenticateJWT, parentReadOnlyGuard, updateTaskStatus);

export default router;
