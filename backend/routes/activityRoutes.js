const express = require('express');
const { getActivityLogs } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin', 'Manager'), getActivityLogs);

module.exports = router;
