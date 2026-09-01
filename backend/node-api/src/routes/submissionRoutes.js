const { Router } = require('express');
const { createSubmission, getSubmissions, getSubmissionById, explainCode } = require('../controllers/submissionController');
const { authenticateJWT, parentReadOnlyGuard } = require('../middleware/auth');

const router = Router();

router.get('/', getSubmissions);
router.post('/explain-code', explainCode);
router.get('/:id', getSubmissionById);
router.post('/', authenticateJWT, parentReadOnlyGuard, createSubmission);

module.exports = router;
