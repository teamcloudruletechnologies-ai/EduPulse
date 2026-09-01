const { Router } = require('express');
const { createTask, updateTaskStatus } = require('../controllers/taskController');
const { authenticateJWT, parentReadOnlyGuard } = require('../middleware/auth');

const router = Router();

router.post('/', authenticateJWT, parentReadOnlyGuard, createTask);
router.patch('/:id/status', authenticateJWT, parentReadOnlyGuard, updateTaskStatus);

module.exports = router;
