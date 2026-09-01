import { Router } from 'express';
import { createSubmission, getSubmissions, getSubmissionById } from '../controllers/submissionController';
import { authenticateJWT, parentReadOnlyGuard } from '../middleware/auth';

const router = Router();

router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);
router.post('/', authenticateJWT, parentReadOnlyGuard, createSubmission);

export default router;
