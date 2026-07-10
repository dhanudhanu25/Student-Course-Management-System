const express = require('express');
const {
  createEnrollment,
  getEnrollments,
  deleteEnrollment,
  updateProgress,
  getRecentActivity,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/recent', protect, authorize('student'), getRecentActivity);
router.put('/progress/:id', protect, authorize('student'), updateProgress);
router.route('/').get(protect, getEnrollments).post(protect, authorize('student'), createEnrollment);
router.route('/:id').delete(protect, deleteEnrollment);

module.exports = router;
