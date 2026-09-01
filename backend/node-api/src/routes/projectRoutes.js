const { Router } = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
} = require('../controllers/projectController');
const { authenticateJWT, parentReadOnlyGuard } = require('../middleware/auth');

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authenticateJWT, parentReadOnlyGuard, createProject);
router.patch('/:id/status', authenticateJWT, parentReadOnlyGuard, updateProjectStatus);

module.exports = router;
