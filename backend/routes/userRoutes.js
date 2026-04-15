const express = require('express');
const { getUsers, createUser, updateUser, getStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', authorize('Admin'), getStats);

router
  .route('/')
  .get(authorize('Admin'), getUsers)
  .post(authorize('Admin'), createUser);

router
  .route('/:id')
  .put(authorize('Admin'), updateUser);

module.exports = router;
