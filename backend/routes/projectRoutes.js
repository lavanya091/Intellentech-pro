const express = require('express');
const { getProjects, createProject, updateProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('Admin', 'Manager'), getProjects)
  .post(authorize('Manager'), createProject);

router
  .route('/:id')
  .put(authorize('Admin', 'Manager'), updateProject);

module.exports = router;
