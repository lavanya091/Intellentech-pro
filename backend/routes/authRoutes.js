const express = require('express');
const { login, getMe, forgotPassword, resetPassword, updateDetails } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
