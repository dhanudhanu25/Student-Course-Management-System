const express = require('express');
const {
  signup,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/signup', upload.single('profileImage'), signup);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/profile', protect, getProfile);
router.put('/update-profile', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

module.exports = router;
