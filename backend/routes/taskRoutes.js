const express = require('express');
const { getTasks, createTask, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(authorize('Manager'), createTask);

router
  .route('/:id')
  .put(updateTask);

module.exports = router;
